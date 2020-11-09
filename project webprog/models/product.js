const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')

const productSchema = new mongoose.Schema({
    nama:{
        type: String,
        required:true,
        unique: true
    },
    img: 
    { 
        data: Buffer, 
        contentType: String 
    },
    sku:{
        type: String,
        required:true,
        unique: true
    },
    price:{
        type: Number,
        required: true
    },
    weight:{
        type: Number,
        required: true
    },
    desc:{
        type: String
    },
    brand:{
        type: String,
        required:true
    },
    category:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true
    }
})

productSchema.pre('validate', function(next){
    if(this.nama){
        this.slug = slugify(this.nama, { lower:true, strict:true })
    }
    next()
})

module.exports = mongoose.model('Product',productSchema)