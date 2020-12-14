const mongoose = require('mongoose')
const slugify = require('slugify')

const brandSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true,
        unique: true
    },
    img: 
    { 
        data: Buffer, 
        contentType: String 
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

brandSchema.pre('validate', function(next){
    if(this.title){
        this.slug = slugify(this.title, { lower:true, strict:true })
    }
    next()
})

module.exports = mongoose.model('Brand',brandSchema)