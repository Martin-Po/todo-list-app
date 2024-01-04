const mongoose = require('mongoose')

const logSchema = new mongoose.Schema(
    {
        app: {
            type: String,
            default: 'Todo-list',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        action: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            default: null,
        },
        endpoint:{
            type: String,
            default: null
        },
        body: {
            type: Object,
            default: null

        },
        previousstate: {
            type: Object,
            default: null

        },
        newstate: {
            type: Object,
            default: null

        },
        result: { type: String, required: true },
        resultmessage: {
            type: String,
            required: true,
        },
        created: { type: Date, default: Date.now }
    }
)

logSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = mongoose.model('Log', logSchema)
