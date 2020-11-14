const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    customerID: {
        type: String,
        required: true
    },
    productID:{
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