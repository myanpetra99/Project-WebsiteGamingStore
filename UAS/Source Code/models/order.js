const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerID: {
        type: String,
        required: true
    },
    orderID:{
        type:String,
    },
   productID:{
       type:String,
       required: true
   },
   qty:{
       type:Number,
       required:true
   },
    total:{
        type: Number
    },
    Status:{
        type: String,
 default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Order',orderSchema)