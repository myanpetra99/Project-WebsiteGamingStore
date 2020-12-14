const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const subCommentSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    productSlug:{
        type:String,
        required: true
    },
    parentComment:{
        type: mongoose.Schema.ObjectId
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

module.exports = mongoose.model('Subcomment',subCommentSchema)