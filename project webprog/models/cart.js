const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    customerID: {
        type: String,
        required: true
    },
    productID:{
        type:String,
        required: true
    },
    qty:{
        type:Number,
        default: 1
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Cart',cartSchema)