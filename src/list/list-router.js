const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const data = require('../data')

const listRouter = express.Router()
const bodyParser = express.json()

listRouter
    .route('/list')
    .get((req, res) => {
        res.json(data.lists)
    })
    .post(bodyParser, (req, res) => {
        const header = req.body.header;
        const bookmarkIds = req.body.bookmarkIds;
        if (!header) {
            logger.error('Header is required');
            return res
                .status(400)
                .send('Invalid Data');
        }
        if (!bookmarkIds) {
            logger.error('bookmarkIds array required');
            return res
                .status(400)
                .send('Invalid Data');
        }
        
        if (bookmarkIds.length > 0) {
            let valid = true;
            bookmarkIds.forEach(cid => {
                const bookmark = data.bookmarks.find(c => c.id == cid);
                if (!bookmark) {
                    logger.error('bookmark with id '+cid+' not found in bookmarks array.');
                    valid = false;
                }
            });
        if (!valid) {
            return res
            .status(400)
            .send('Invalid Data')
        }
    }
        
        const id = uuid();
    
        const list = {
            id,
            header,
            bookmarkIds
        };
    
        data.lists.push(list);
    
        logger.info(`List with id ${id} created`)
    
        res
        .status(201)
        .location('http://localhost:8000/list/'+id)
        .json({id})
    })

listRouter
    .route('/list/:id')
    .get((req,res)=>{
        const { id } = req.params;
    const list = data.lists.find(li => li.id == id);

    if (!list) {
        logger.error(`List with id ${id} not found.`)
        return res
        .status(404)
        .send('List Not Found')
    }

    res.json(list)
    })
    .delete((req,res)=>{
        const { id } = req.params;
    console.log(id)
    const listIndex = data.lists.findIndex(li=>li.id == id)

    if (listIndex === -1) {
        logger.error('List with id'+id+' not found.');
        return res
            .status(404)
            .send('Not Found');
    }

    data.lists.splice(listIndex,1);

    logger.info('list with id '+id+' deleted.');
    res
        .status(204)
        .end();
    })

    module.exports = listRouter