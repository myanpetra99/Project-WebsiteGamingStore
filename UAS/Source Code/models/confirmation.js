const mongoose = require('mongoose')

const confirmationSchema = new mongoose.Schema({
    orderID:{
        type: String,
        required:true,
    },
    userID:{
        type: String
    },
   invoice:{
    data: Buffer, 
    contentType: String 
   }
})


module.exports = mongoose.model('Confirmation',confirmationSchema)