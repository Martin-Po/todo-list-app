const mongoose = require('mongoose')


const listSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Must be at least 3 characters long, actual lenght is {VALUE}'],
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    collaborators: [
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    listelements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listelement',
            default: null
        }
    ],
    pinned: [
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
})

listSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('List', listSchema)