const mongoose = require('mongoose')

const checkoutSchema = new mongoose.Schema({
    customerID: {
        type: String,
        required: true
    },
    orderID:{
        type:String,
        required: true
    },
    Detail:{
        type: Object
    },
    Status:{
        type: String,
 default: 'PENDING'
    },
    createdAt: {
        type: Date,
        default: Date
    }
})

module.exports = mongoose.model('Checkout',checkoutSchema)