const bcrypt = require('bcrypt')
const listsRouter = require('express').Router()
const List = require('../models/list')
const User = require('../models/user')
const Listelement = require('../models/listelement')
const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')
const Log = require('../models/log')

listsRouter.get('/', async (request, response) => {
    let LogEntry = new Log({
        user: request.user ? request.user.id : null,
        action: 'Get all lists',
        method: 'GET',
        endpoint: '/api/lists',
        body: request.body,
        previousstate: null,
        newstate: null,
        result: '',
        resultmessage: '',
    })

    try {
        const lists = await List.find({}).populate({
            path: 'owner',
            select: '-list -role',
        })

        LogEntry.result = 'Success'
        LogEntry.resultmessage = 'Lists returned'

        response.json(lists)
    } catch (exception) {
        LogEntry.result = 'Unexpected error'
        LogEntry.resultmessage = exception.message
        next(exception)
    } finally {
        await LogEntry.save()
    }
})

listsRouter.get('/:id', async (request, response, next) => {
    let LogEntry = new Log({
        user: request.user ? request.user.id : null,
        action: 'Get list ',
        method: 'GET',
        endpoint: '/api/lists/' + request.params.id,
        body: request.body,
        previousstate: null,
        newstate: null,
        result: '',
        resultmessage: '',
    })

    try {
        const list = await List.findById(request.params.id).populate({
            path: 'owner',
            select: '-list -role -player',
        })
        if (list) {
            LogEntry.newstate = list
            LogEntry.result = 'Success'
            LogEntry.resultmessage = 'List returned'
            response.json(list)
        } else {
            LogEntry.result = 'Failed'
            LogEntry.resultmessage = 'List not found in collection'
            response.status(404).end()
        }
    } catch (exception) {
        LogEntry.result = 'Failed'
        LogEntry.resultmessage = 'List could not be returned'
        next(exception)
    } finally {
        await LogEntry.save()
    }
})

listsRouter.post(
    '/',
    middleware.userExtractor,
    async (request, response, next) => {
        let LogEntry = new Log({
            user: request.user ? request.user.id : null,
            action: 'Create new list ',
            method: 'POST',
            endpoint: '/api/lists/' + request.params.id,
            body: request.body,
            previousstate: null,
            newstate: null,
            result: '',
            resultmessage: '',
        })

        const body = request.body
        console.log(request.body)
        console.log('llegó')
        try {
            const decodedToken = jwt.verify(request.token, process.env.SECRET)
            const user = request.user
            console.log('llegó2')
            if (!decodedToken.id) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'token invalid' 
                return response.status(401).json({ error: 'token invalid' })
            }

            console.log('llegó5')
            if (!body.name) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'name missing' 
                return response.status(400).json({
                    error: 'name missing',
                })
            }
            console.log('llegó6')
            console.log('cargando list')

            const list = new List({
                name: body.name,
                owner: user._id,
                collaborators: [],
            })

            try {
                const savedList = await list.save()

                // Populate the list data with listskills and listpositions
                const populatedList = await List.findById(
                    savedList._id
                ).populate({
                    path: 'owner',
                    select: '-list -role -player',
                })

                LogEntry.newstate = populatedList

                LogEntry.result = 'Sucess'
                LogEntry.resultmessage= 'List created' 

                response.status(201).json(populatedList)
            } catch (exception) {
                LogEntry.result = 'Unexpected error'
                LogEntry.resultmessage= exception.message 
                next(exception)
            }
        } catch (exception) {
            next(exception)
        }
        finally{
            await LogEntry.save()
        }
        
    }
)

listsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    let LogEntry = new Log ({
        user: request.user.id,
        action: 'Edit list ',
        method: 'PUT',
        endpoint: '/api/lists/' + request.params.id,
        body: request.body,
        previousstate: null,
        newstate: null,
        result: '',
        resultmessage: '',
    })

    try {
        // Find the list by ID
        const list = await List.findById(request.params.id)

        if (!list) {
            LogEntry.result = 'Failed'
            LogEntry.resultmessage= 'List not found' 
            return response.status(404).json({ error: 'List not found' })
        }

        LogEntry.previousstate = list

        if (!body.collaborator && !body.name) {
            LogEntry.result = 'Failed'
            LogEntry.resultmessage= 'Either collaborator or name must be provided' 
            return response
                .status(409)
                .json({ error: 'Either collaborator or name must be provided' })
        }

        // Handle conflicting properties
        if (body.collaborator && body.name) {
            LogEntry.result = 'Failed'
            LogEntry.resultmessage= 'Cannot update both collaborator and name' 
            return response
                .status(400)
                .json({ error: 'Cannot update both collaborator and name' })
        }

        // Update collaborator
        if (body.collaborator) {
            if (body.collaborator === list.owner.toString()) {
                LogEntry.result = 'Failed'
            LogEntry.resultmessage= 'Owner cannot be set as collaborator' 
                return response
                    .status(400)
                    .json({ error: 'Owner cannot be set as collaborator' })
            }

            if (list.collaborators.includes(body.collaborator)) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'Collaborator already in list' 
                return response
                    .status(400)
                    .json({ error: 'Collaborator already in list' })
            }

            const existingUser = await User.findById(body.collaborator)

            if (existingUser) {
                list.collaborators.push(body.collaborator)
                LogEntry.result = 'Success'
                LogEntry.resultmessage= 'List collaborator added succesfully' 
            } else {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'Collaborator must be an existing user' 
                return response
                    .status(400)
                    .json({ error: 'Collaborator must be an existing user' })
            }
        }

        // Update name
        if (body.name) {
            list.name = body.name
                LogEntry.result = 'Success'
                LogEntry.resultmessage= 'List name edited' 
        }

        // Save the updated list
        const updatedList = await list.save()

        // Populate the owner field in the response
        await updatedList.populate({
            path: 'owner',
            select: '-list -role -player',
        })

        LogEntry.newstate = list


        return response.json(updatedList)
    } catch (exception) {
        LogEntry.result = 'Unexpected error'
        LogEntry.resultmessage= exception.message 
        next(exception)
    }
    finally{
        await LogEntry.save()
    }
})

listsRouter.delete(
    '/:id/collaborators/:collaboratorId',
    middleware.userExtractor,
    async (request, response, next) => {
        let LogEntry = new Log ({
            user: request.user.id,
            action: 'Delete collaborator from list ',
            method: 'DELETE',
            endpoint: '/api/lists/' + request.params.id + '/collaborators/' + request.params.collaboratorId ,
            body: request.body,
            previousstate: null,
            newstate: null,
            result: '',
            resultmessage: '',
        })
        try {
            const list = await List.findById(request.params.id)

            if (!list) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'List not found' 
                return response.status(404).json({ error: 'List not found' })
            }

            LogEntry.previousstate = list

            const collaboratorId = request.params.collaboratorId

            // Check if the collaborator is in the list
            if (
                !list.collaborators.some(
                    (collaborator) => collaborator.toString() === collaboratorId
                )
            ) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'Collaborator not found in the list' 
                return response
                    .status(404)
                    .json({ error: 'Collaborator not found in the list' })
            }


            // Remove the collaborator from the list
            list.collaborators = list.collaborators.filter(
                (id) => id.toString() !== collaboratorId
            )

            // Save the updated list
            const updatedList = await list.save()

            // Populate the owner field in the response
            await updatedList.populate({
                path: 'owner',
                select: '-list -role -player',
            })

            LogEntry.newstate = updatedList
            LogEntry.result = 'Success'
            LogEntry.resultmessage= 'Collaborator not found in the list' 

            return response.json(updatedList)
        } catch (exception) {
            LogEntry.result = 'Unexpected error'
            LogEntry.resultmessage= exception.message 
            next(exception)
        }
        finally{
            await LogEntry.save()
        }
    }
)

listsRouter.delete(
    '/:id',
    middleware.userExtractor,
    async (request, response, next) => {
        let LogEntry = new Log ({
            user: request.user.id,
            action: 'Delete list ',
            method: 'DELETE',
            endpoint: '/api/lists/' + request.params.id ,
            body: request.body,
            previousstate: null,
            newstate: null,
            result: '',
            resultmessage: '',
        })

        try {
            const decodedToken = jwt.verify(request.token, process.env.SECRET)
            const user = request.user
            const list = await List.findById(request.params.id)
                .populate({
                    path: 'owner',
                    select: '-list -role -player',
                })
                .populate('collaborators')

            if (!list) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'List not found' 
                return response.status(404).json({ error: 'List not found' })
            }
            LogEntry.prependOnceListener = list

            if (!decodedToken.id) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'token invalid' 
                return response.status(401).json({ error: 'token invalid' })
            }

            if (user.role !== 'admin' && user.id !== list.owner.id) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'must be admin' 
                return response.status(401).json({ error: 'must be admin' })
            }

            try {
                await Listelement.deleteMany({
                    list: { $in: [request.params.id] },
                })

                await List.findByIdAndRemove(request.params.id)

                LogEntry.result = 'Success'
                LogEntry.resultmessage= 'List deleted' 

                response.status(204).end()
            } catch (exception) {
                next(exception)
            }
        } catch (exception) {
            LogEntry.result = 'Unexpected error'
            LogEntry.resultmessage= exception.message 
            next(exception)
        }
        finally{
            await LogEntry.save()
        }
    }
)

module.exports = listsRouter
