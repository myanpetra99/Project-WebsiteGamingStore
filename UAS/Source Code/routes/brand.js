const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var db = mongoose.connection;
const Brands = require('../models/brand')
router.get('/brand', async function(req, res) {
    const brands = await Brands.find()
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
      
      console.log(brands)
      res.render('pages/brands', {name: req.user.name,
          isLoggedIn: true, badgecart:badgeCart, brands: brands});
          console.log(brands)
    }
    else{
      res.render('pages/brands', {isLoggedIn: false, brands: brands});
      console.log(brands)
    }
  });
  

module.exports = router