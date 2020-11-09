const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required:true,
    },
    address:{
        type: String,
        required: true
    },
    zip:{
        type: Number,
        required: true
    },
    phone:{
        type: Number,
        required:true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        default: 'USER'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User',userSchema)