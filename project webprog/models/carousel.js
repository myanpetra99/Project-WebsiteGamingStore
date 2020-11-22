const mongoose = require('mongoose')
const slugify = require('slugify')

const carouselSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    img: 
    { 
        data: Buffer, 
        contentType: String 
    },
    text:{
        type: String
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

carouselSchema.pre('validate', function(next){
    if(this.title){
        this.slug = slugify(this.title, { lower:true, strict:true })
    }
    next()
})

module.exports = mongoose.model('Carousel',carouselSchema)