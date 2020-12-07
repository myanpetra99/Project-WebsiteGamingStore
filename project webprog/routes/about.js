const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var db = mongoose.connection;

router.get('/about', async function(req, res) {
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
      res.render('pages/about', {name: req.user.name,
          isLoggedIn: true, badgecart:badgeCart});
    }
    else{
      res.render('pages/about', {isLoggedIn: false});
    }
  });
  
  module.exports = router