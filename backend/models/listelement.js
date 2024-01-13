const mongoose = require('mongoose')


const listelementSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        default: null
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    checked: 
        {   
            type: Boolean,
            default: false
        }
    ,
})

listelementSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Listelement', listelementSchema)