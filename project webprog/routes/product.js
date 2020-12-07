const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var db = mongoose.connection;
const Cart = require('../models/cart');
const Categories = require('../models/category');
const Brands = require('../models/brand');
const Products = require('../models/product')
const Galleries = require('../models/gallery')
const Comment = require('../models/comment')
const Subcomment = require('../models/subcomment')
router.get('/product', async function(req, res) {
    const categories = await Categories.find()
    const brands = await Brands.find()
    const page = parseInt(req.query.page) >= 1 ? parseInt(req.query.page) : 1;
    const limit = 20
    const pagination = {}
    const startIndex = (page -1) * limit
    const endIndex = page* limit
    let products
    let query = {}
    let reqbrand
    let reqcategory
    let jumlah =  await Products.countDocuments().exec()
    if (req.query.q){
query.nama = {'$regex' : req.query.q, '$options' : 'i'}
    }
    if ( req.query.category){
        query.category = {'$regex' : req.query.category, '$options' : 'i'}
        reqcategory = req.query.category
    }

    if ( req.query.brand){
        query.brand = {'$regex' : req.query.brand, '$options' : 'i'}
       reqbrand = req.query.brand
    }
    if ( (JSON.stringify(query) === '{}') == false){
       await Products.find(query).limit(limit)
        .skip(startIndex)
        .then((results) => {
           products = results
          if (endIndex < jumlah)
          {
           pagination.next = {
               page : page +1,
               limit: limit
           }
  
          }
          if (startIndex > 0){
           pagination.previous = {
               page: page-1,
               limit: limit
           }
 
          }
   
        })
        .catch((err) => {
          console.log(err)
          res.redirect('/')
        })
    }else{
        await Products.find().limit(limit)
         .skip(startIndex)
         .then((results) => {
            products = results
           if (endIndex < jumlah)
           {
            pagination.next = {
                page : page +1,
                limit: limit
            }
           }
           if (startIndex > 0){
            pagination.previous = {
                page: page-1,
                limit: limit
            }
           }  
         })
         .catch((err) => {
           console.log(err)
           res.redirect('/')
         })
    }

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
        res.render('pages/product',
    {name: req.user.name,
        isLoggedIn: true, products:products, badgecart:badgeCart, pagination:pagination, currentpage:page, categories:categories, brands:brands, reqbrand:reqbrand, reqcategory:reqcategory});
    }else{
        res.render('pages/product',
    {isLoggedIn: false, products:products, pagination:pagination, currentpage:page, categories:categories, brands:brands , reqbrand:reqbrand, reqcategory:reqcategory});
    }


    
});

//route item

router.get('/product/item/:slug', async (req,res)=>{
  
    const galleries = await Galleries.find({ slug: req.params.slug})
    const product = await Products.findOne({ slug: req.params.slug})
    const comment = await Comment.find({productSlug: req.params.slug})
    const subcomment = await Subcomment.find({productSlug: req.params.slug})
    if(product == null) {res.redirect('/product')}
    
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

        res.render('pages/item',
        {name: req.user.name,
            isLoggedIn: true, product:product, galleries:galleries,badgecart:badgeCart, comments:comment, subcomments:subcomment});
    }   
    else{
        res.render('pages/item',
        {isLoggedIn: false, product:product, galleries:galleries, comments:comment, subcomments:subcomment});
    }
})


router.post('/product/item/:slug/comment', async(req,res)=>{

    let newComment = new Comment({
        customerName : req.user.name,
        productSlug: req.params.slug,
        textComment : req.body.textComment,
    })
    try{
        newComment.save()
    res.redirect(`/product/item/${req.params.slug}`)
}catch (e){
    res.redirect(`/product/item/${req.params.slug}`)
    console.log(e)
}
})

router.post('/product/item/:slug/:id/subcomment', async(req,res)=>{

    let newSubComment = new Subcomment({
        customerName : req.user.name,
        productSlug: req.params.slug,
        parentComment: req.params.id,
        textComment : req.body.textComment,
    })
    try{
        newSubComment.save()
    res.redirect(`/product/item/${req.params.slug}`)
}catch (e){
    res.redirect(`/product/item/${req.params.slug}`)
    console.log(e)
}
})

router.post('/add-to-cart/:id', async (req,res,next) =>{
    const cartCollection = db.collection("carts");
    const update = { "$inc": { "qty": 1 } };
    const options = { "upsert": true };

    const product = await Products.findById(req.params.id)
    const query = { "customerID": req.user.id, "productID": product.id };
    let findCart = await Cart.findOne({customerID: req.user.id, productID: product.id})
    if(findCart == null)
    {
        let newCart = new Cart({
            customerID: req.user.id,
            productID: product.id,
        })
        try{
            newCart.save()
            console.log('new Cart Saved!')
          res.redirect(`/cart`)
      }catch (e){
          res.redirect('/')
          console.log('ERror')
          console.log(e)
          res.redirect(`/product/item/${product.slug}`)
      }
    }else{
        cartCollection.updateOne(query,update,options).then(result=>{
            console.log('Cart Exist!!')
        })
     res.redirect(`/cart`)
    }
        
})



module.exports = router