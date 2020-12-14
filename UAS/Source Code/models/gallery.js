const mongoose = require('mongoose')
const slugify = require('slugify')

const gallerySchema = new mongoose.Schema({
    title:{
        type: String,
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
    }
})

gallerySchema.pre('validate', function(next){
    if(this.title){
        this.slug = slugify(this.title, { lower:true, strict:true })
    }
    next()
})

module.exports = mongoose.model('Gallery',gallerySchema)