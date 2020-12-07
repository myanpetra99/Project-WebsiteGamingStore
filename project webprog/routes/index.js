const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var db = mongoose.connection;

const Carousels = require('../models/carousel')
const Products = require('../models/product')





router.get('/', async function(req, res) {
    const productsMouse = await Products.find({category: 'Mouse'}).sort({_id:-1}).limit(10)
    const productsKeyboard = await Products.find({category: 'Keyboard'}).sort({_id:-1}).limit(10)
    const productsHeadset = await Products.find({$or: [ { category: 'Headset' }, { category: 'Earphone' } ]}).sort({_id:-1}).limit(10)
    const productsChair = await Products.find({$or: [ { category: 'Gaming Chair' }, { category: 'Kursi Gaming' } ]}).sort({_id:-1}).limit(10)
    const productsOther = await Products.find({category: { $nin: [ 'Mouse', 'Keyboard', 'Headset','Earphone', 'Gaming Chair', 'Kursi Gaming' ] }}).sort({_id:-1}).limit(10)
    const carousels = await Carousels.find()
    if(req.isAuthenticated()){
        var badgeCart
        const userid = req.user.id
        await db.collection('carts').countDocuments({customerID:userid.toString()},{ limit: 100 }).then((docs) =>{
            try{
                badgeCart = docs
            }
            catch (e){
             console.log(e)
            }
        })

        console.log(`ID user Yang lagi dipakai: ${req.user.id}`)
        console.log(badgeCart)
        res.render('pages/index',
        {name: req.user.name,
            isLoggedIn: true, badgecart: badgeCart, productsMouse: productsMouse, productsKeyboard:productsKeyboard, productsHeadset:productsHeadset, productsChair:productsChair, productsOther:productsOther, carousels:carousels});
    }
    else{
        res.render('pages/index',
    {isLoggedIn: false, productsMouse: productsMouse, productsKeyboard:productsKeyboard, productsHeadset:productsHeadset, productsChair:productsChair, productsOther:productsOther, carousels:carousels});
    }
    
});

module.exports = router