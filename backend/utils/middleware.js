const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Log = require('../models/log')


const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = async (request, response, next) => {
    let LogEntry = new Log ({
        user: request.user ? request.user.id : null,
        action: 'Unknown endpoint',
        endpoint: request.originalUrl,
        body: request.body,
        result: 'Unknown endpoint',
        resultmessage: 'Unknown endpoint',
    })

    await LogEntry.save()
    console.log('unknown endpoint');
    next()

}

const errorHandler = async (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name ===  'JsonWebTokenError') {

        return response.status(400).json({ error: 'token missing or invalid' })
    }
    console.log(error.name)
    next(error)
}

const tokenExtractor = async (request, response, next) => {
    const authorization = await request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.substring(7)
        request.token = token
    }
    next()
}

const userExtractor = async (request, response, next) => {
  

    console.log(request.token)
    console.log('prueba user')
    console.log(request.originalUrl)
    try{
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if(decodedToken){
            request.user = await User.findById(decodedToken.id.toString())
        
        } else {
            request.user = null
        }
    }
    catch{
        let LogEntry = new Log ({
            action: 'User validation middleware',
            endpoint: request.originalUrl,
            body: request.body,
            result: 'User validation failed',
            resultmessage: 'token missing or invalid',
        })

        await LogEntry.save()
        return response.status(401).json({ error: 'token missing or invalid' }) 
    }    

    next()
}


module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}