const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    productSlug:{
        type:String,
        required: true
    },
    textComment:{
       type:String,
       required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment',commentSchema)