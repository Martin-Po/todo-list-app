const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')

const listsRouter = require('./controllers/lists')
const listelementsRouter = require('./controllers/listelements')




const loginRouter = require('./controllers/login')

const usersRouter = require('./controllers/users')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')


const mongoose = require('mongoose')
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message) 
    })

const path = require('path')



console.log(process.env.NODE_ENV)
console.log('chau')

app.use(cors())
app.use(express.static('build')) 
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/lists', listsRouter, middleware.userExtractor)
app.use('/api/listelements', listelementsRouter, middleware.userExtractor)



app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))})
        
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

    
module.exports = app