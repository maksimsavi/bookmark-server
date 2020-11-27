const express = require('express')
const { v4: uuid } = require('uuid')
const data = require('../data')
const logger = require('../logger')
const { NODE_ENV } = require('../config')

const app = express()
const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
  .route('/bookmark')
  .get((req, res) => {
    res.json(data.bookmarks)
  })
  .post(bodyParser, (req, res) => {
    const { title, content } = req.body;
    if (!title) {
        logger.error('Title is required');
        return res
            .status(400)
            .send('Invalid Data')
    }
    if (!content) {
        logger.error('Content is required');
        return res
            .status(400)
            .send('Invalid Data')
    }
    //get an id
    const id = uuid()
    const bookmark = {
        id,
        title,
        content
    };
    data.bookmarks.push(bookmark);
    logger.info('bookmark with id '+id+' created');
    res
        .status(201)
        .location('http://localhost:8000/bookmark/'+id)
        .json(bookmark)
  })

  bookmarkRouter
  .route('/bookmark/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = data.bookmarks.find(c=>c.id == id);
    if (!bookmark) {
        logger.error('bookmark with id '+id+' not found.');
        return res
            .status(404)
            .send('bookmark Not Found')
    }

    res.json(bookmark)
  })
  .delete((req, res) => {
    const {id} = req.params;

    const bookmarkIndex = data.bookmarks.findIndex(c=> c.id == id);

    if (bookmarkIndex === -1) {
        logger.error('bookmark with id '+' not found.');
        return res
            .status(404)
            .send('Not found')
    }
    //remove bookmark from lists, assume IDs aren't duplicated in the array
    data.lists.forEach(list => {
        const bookmarkIds = list.bookmarkIds.filter(cid => cid !== id);
            data.lists.bookmarkIds = bookmarkIds;
    });

    data.bookmarks.splice(bookmarkIndex, 1);

    logger.info('bookmark with id '+id+' deleted.')

    res
        .status(204)
        .end();
  })

module.exports = bookmarkRouter