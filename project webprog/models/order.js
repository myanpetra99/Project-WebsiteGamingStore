const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
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
        default: Date.now
    }
})

module.exports = mongoose.model('Order',orderSchema)