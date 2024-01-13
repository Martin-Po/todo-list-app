const bcrypt = require('bcrypt')
const listelementsRouter = require('express').Router()
const Listelement = require('../models/listelement')
const List = require('../models/list')
const Log = require('../models/log')
const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')
const listelement = require('../models/listelement')
const log = require('../models/log')

listelementsRouter.get('/', middleware.userExtractor,async (request, response) => {
    let LogEntry = new Log ({
        user: request.user ? request.user.id : null,
        action: 'Get all list elements',
        method: 'GET',
        endpoint: '/api/listelements',
        body: request.body,
        previousstate: null,
        newstate: null,
        result: '',
        resultmessage: '',
    })
    try{
    const listelements = await Listelement.find({}).populate({
        path: 'creator',
        select: '-listelement -role',
    })

    LogEntry.result = 'Success'
    LogEntry.resultmessage= 'List elements returned' 
    response.json(listelements)
}

catch(exception){
    LogEntry.result = 'Unexpected error'
    LogEntry.resultmessage= exception.message 
    next(exception)
}
finally{
    await LogEntry.save()}

})

listelementsRouter.get('/:id', middleware.userExtractor, async (request, response, next) => {
    let LogEntry = new Log ({
        user: request.user.id,
        action: 'Get list element ' + request.params.id,
        method: 'GET',
        endpoint: '/api/listelements/'+ request.params.id,
        body: request.body,
        previousstate: null,
        newstate: null,
        result: '',
        resultmessage: '',
    })
    try {
        const listelement = await Listelement.findById(request.params.id).populate({
            path: 'creator',
            select: '-role',
        })
        if (listelement) {
        LogEntry.newstate = listelement
        LogEntry.result = 'Success'
        LogEntry.resultmessage= 'List element returned' 
            response.json(listelement)
        } else {
            LogEntry.result = 'Failed'
            LogEntry.resultmessage= 'List element not found in collection' 
            response.status(404).end()
        }
    } catch (exception) {
        LogEntry.result = 'Failed'
        LogEntry.resultmessage= 'List element could not be returned' 
        next(exception)
    }
    finally{
        await LogEntry.save()
    }
})

listelementsRouter.post(
    '/',
    middleware.userExtractor,
    async (request, response, next) => {
        console.log('entro al controlador');

    

        const body = request.body
        let LogEntry = new Log ({
            user: request.user.id,
            action: 'Create new list element on list',
            method: 'POST',
            endpoint: '/api/listelements/',
            body: request.body,
            previousstate: null,
            newstate: null,
            result: '',
            resultmessage: '',
        })
        try {

            const list = await List.findById(body.list)

            const decodedToken = jwt.verify(request.token, process.env.SECRET)
            const user = request.user
            if (!decodedToken.id) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'token invalid' 
                return response.status(401).json({ error: 'token invalid' })
            }

            if (!list)
            {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'List deoes not  exist' 

                return response.status(400).json({
                    error: 'List deoes not  exist',
                })
            }

            LogEntry.action.concat(list.id)

            if (list.owner.toString() !== user.id && !list.collaborators.some(collaboratorId => collaboratorId.toString() === user.id)) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'User does not have access to this list' 

                return response.status(401).json({ error: 'User does not have access to this list' })
            }

            if (!body.description) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'description missing' 

                return response.status(400).json({
                    error: 'description missing',
                })
            }

            const listelement = new Listelement({
                description: body.description,
                creator: user._id,
                list: list._id
                
            })

            try {
            console.log('hasta aca llegó');

                const savedListelement = await listelement.save()

            console.log('hasta aca llegó2');


                // Populate the listelement data with listelementskills and listelementpositions
                const populatedListelement = await Listelement.findById(
                    savedListelement._id
                ).populate('creator')

                await List.findByIdAndUpdate(list._id, {
                    $push: { listelements: savedListelement._id },
                });

                LogEntry.newstate = populatedListelement

                LogEntry.result = 'Sucess'
                LogEntry.resultmessage= 'List elemement created' 
            


                response.status(201).json(populatedListelement)
            } catch (exception) {
                next(exception)
            }
        } catch (exception) {
            LogEntry.result = 'Unexpected error'
            LogEntry.resultmessage= exception.message 
            next(exception)
        }
        finally{
            console.log('aca da el error');
            await LogEntry.save()
        }
    }
)

listelementsRouter.put('/:id',  middleware.userExtractor, async (request, response, next) => {
    const body = request.body;
    const user = request.user

    let LogEntry = new Log ({
        user: request.user ? request.user.id : null,
        action: 'Edit list element ',
        method: 'PUT',
        endpoint: '/api/listelements/' + request.params.id,
        body: request.body,
        previousstate: null,
        newstate: null,
        result: '',
        resultmessage: '',
    })

    try {
        // Find the list by ID
        const listElement = await listelement.findById(request.params.id);
        const list = await List.findById(listElement.list)

        


        if (!listElement) {
            LogEntry.result = 'Failed'
            LogEntry.resultmessage= 'List element not found' 
            return response.status(404).json({ error: 'List element not found' });
        }
        LogEntry.previousstate = listElement
        LogEntry.action.concat(request.params.id)

        if ((!('checked' in body) ) && !body.description) {
            LogEntry.result = 'Failed'
            LogEntry.resultmessage= 'Either description or checked state must be provided'
            return response.status(409).json({ error: 'Either description or checked state must be provided' });
        }

        if ('checked' in body && typeof body.checked !== 'boolean') {
            LogEntry.result = 'Failed'
            LogEntry.resultmessage= 'The "checked" property must be a boolean'
            return response.status(400).json({ error: 'The "checked" property must be a boolean' });
        }

        // Handle conflicting properties
        if (body.checked && body.description) {
            LogEntry.result = 'Failed'
            LogEntry.resultmessage= 'Cannot update both description and checked state'
            return response.status(400).json({ error: 'Cannot update both description and checked state' });
        }


        if (list.owner.toString() !== user.id && !list.collaborators.some(collaboratorId => collaboratorId.toString() === user.id)) {
            LogEntry.result = 'Failed'
            LogEntry.resultmessage= 'User does not have access to this list' 

            return response.status(401).json({ error: 'User does not have access to this list' })
        }

        console.log();
        // Update checked
        if ('checked' in body && typeof body.checked === 'boolean') {
            console.log('en el if');

            LogEntry.result = 'Success'
            console.log(LogEntry.result);
            LogEntry.resultmessage= 'Checked status changed'
            listElement.checked = body.checked;
        }

        // Update description
        if (body.description) {
            LogEntry.result = 'Success'
            LogEntry.resultmessage= 'Description changed'
            listElement.description = body.description;
        }

        console.log('en el cambio');
        console.log(LogEntry.result);
       LogEntry.newstate = listElement

        // Save the updated list
        const updatedListelement = await listElement.save();

        // Populate the owner field in the response
        await updatedListelement.populate('creator')

        return response.json(updatedListelement);
    } catch (exception) {
        LogEntry.result = 'Unexpected error'
        LogEntry.resultmessage= exception.message 
        next(exception);
    }
    finally{
        await LogEntry.save()
    }
});

listelementsRouter.delete(
    '/:id',
    middleware.userExtractor,
    async (request, response, next) => {

        let LogEntry = new Log ({
            user: request.user.id,
            action: 'Delete list element ',
            method: 'DELETE',
            endpoint: '/api/listelements/' + request.params.id,
            body: request.body,
            previousstate: null,
            newstate: null,
            result: '',
            resultmessage: '',
        })
        try {
            console.log('usuario');
            console.log(request.user);
            const decodedToken = jwt.verify(request.token, process.env.SECRET)
            const user = request.user
            const listelement = await Listelement.findById(request.params.id)
            .populate('creator')

            if (!listelement) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'List element not found'
                return response.status(404).json({ error: 'Listelement not found' })
            }
            LogEntry.action.concat(request.params.id)

            LogEntry.previousstate = listelement

            if (!decodedToken.id) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'token invalid'
                return response.status(401).json({ error: 'token invalid' })
            }

            if (user.role !== 'admin' && user.id !== listelement.owner.id) {
                LogEntry.result = 'Failed'
                LogEntry.resultmessage= 'must be admin or owner of the list'
                return response.status(401).json({ error: 'must be admin or owner of the list' })
            }          

            try {
                await List.updateMany(
                    { listelements: { $in: [request.params.id] } },
                    { $pull: { listelements: request.params.id } }
                );
                await Listelement.findByIdAndRemove(request.params.id)
                LogEntry.result = 'Success'
                LogEntry.resultmessage= 'List element deleted'

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

module.exports = listelementsRouter
