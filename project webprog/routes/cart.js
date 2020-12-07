const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var db = mongoose.connection;
const Cart = require('../models/cart');
var auth = require('../middleware/Auth')
const Products = require('../models/product')
const Order = require('../models/order')

router.get('/cart',auth.ensureAuthenticate, async function(req, res) {

    let userId = req.user.id
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
    
    var displayCart = []
    db.collection('carts').aggregate([
        { "$match" : { "customerID" : userId } },
        { "$addFields": { "prodID": { "$toObjectId": "$productID" }}},
        { "$lookup": {
          "from": "products",
          "localField": "prodID",
          "foreignField": "_id",
          "as": "fromItems"
        }},
        {
            "$replaceRoot": { "newRoot": { "$mergeObjects": [ { "$arrayElemAt": [ "$fromItems", 0 ] }, "$$ROOT" ] } }
         },{ "$project": { "fromItems": 0 } }
      ]).toArray(function(err, result) {
        if (err) throw err;
    
    displayCart = result
    console.log(displayCart)
    res.render('pages/cart', {name: req.user.name,
        isLoggedIn: true, carts: displayCart, badgecart:badgeCart, phone:req.user.phone, address:req.user.address, zip:req.user.zip});
      });
    
    
    
    });
    
    
    router.delete('/cart/:id/delete', async (req, res)=>{
        await Cart.findByIdAndDelete(req.params.id)
    
        res.redirect('/cart')
    })
    

    
    router.post('/cart/:id/increase', async (req,res,next) =>{

    const cartCollection = db.collection("carts");
    const update = { "$inc": { "qty": 1 } };
    const options = { "upsert": true };

    const query = { "customerID": req.user.id, "productID": req.params.id };
    
      try {
        cartCollection.updateOne(query,update,options).then(result=>{
            console.log('Cart Updated +1')
        })
      } catch (error) {
          console.log('cart Failed Update!')
          console.log(error)
      }
     res.redirect(`/cart`)
    }
        
)

router.post('/cart/:id/decrease', async (req,res,next) =>{

    const cartCollection = db.collection("carts");
    const update = { "$inc": { qty: -1 } };
    const options = { "upsert": true };

    const query = { "customerID": req.user.id, "productID": req.params.id };
    
      try {
        cartCollection.updateOne(query,update,options).then(result=>{
            console.log('Cart Updated -1')
        })
      } catch (error) {
          console.log('cart Failed Update!')
          console.log(error)
      }
     res.redirect(`/cart`)
    }
        
)


router.post('/cart/checkout', async (req,res,next)=>{
    (await Cart.find({customerID: req.user.id})).forEach((doc)=>{
        let newOrder = new Order({
            customerID: req.user.id,
            orderID: req.body.randOrderId,
            productID: doc.productID , 
            qty: doc.qty,
            total:req.body.totalOrder
        })
        try{
            newOrder.save()
            db.collection('carts').deleteMany({customerID: req.user.id})
            res.redirect(`/history`)
      }catch (e){
          console.log('Error getting History Order!')
          console.log(e)
          res.redirect(`/`)
      }
    })
    console.log('new Order saved!')
   
   
})


router.get('/buy-now/:slug', async (req,res)=>{
    
    const product = await Products.findOne({ slug: req.params.slug})
    var badgeCart
    const userid = req.user._id
    await db.collection('carts').countDocuments({customerID:userid.toString()},{ limit: 100 }).then((docs) =>{
        try{
            badgeCart = docs
        }
        catch (e){
         console.log(e)
        }
    })
    
    if(product == null){ res.redirect('/product')}
    
    if(req.isAuthenticated()){
        res.render('pages/buy-now', {name: req.user.name,
            isLoggedIn: true, product:product,badgecart:badgeCart,phone:req.user.phone, address:req.user.address, zip:req.user.zip});
    }   
    else{
        res.redirect('/login')
    }
})


router.post('/buy-now/:slug/checkout', async (req,res,next)=>{
const product = await Products.findOne({slug:req.params.slug})

    let newOrder = new Order({
        customerID: req.user.id,
        orderID: req.body.randOrderId,
        productID: product._id,
        qty: req.body.qtyOrder,
        total:req.body.totalOrder
    })
    try{
        newOrder.save()
        console.log('Buy now saved!')
        res.redirect(`/history`)
}catch (e){
    console.log('Error instant Checkout!')
    console.log(e)
    res.redirect(`/product`)
}
   
})

module.exports = router