require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bookmarkRouter = require('./bookmark/bookmark-router')
const listRouter = require('./list/list-router')

const app = express()

const morganOption = (NODE_ENV === 'production')?"tiny":"common";
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

//token validation
app.use(function validateBearerToken(req,res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken  = req.get("Authorization")
    
    if (authToken !== apiToken) {
        logger.error('Unauthorized request to: '+req.path)
        console.log(authToken+" "+apiToken)
        return res.status(401).json({ error: "Unauthorized request"})
    }
    next()
})

app.use(bookmarkRouter)
app.use(listRouter)
//stock get request
app.get('/', (req,res)=>{
    res.send("Hello, boilerplate!")
    
})

//error handler
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV==='production') {
        response = {error: { message: 'sever error'}}
    } else {
        console.error(error)
        response = {message, error}
    }
    res.status(500).json(response)
})

module.exports = app

