const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var db = mongoose.connection;
var auth = require('../middleware/Auth')


router.get('/history',auth.ensureAuthenticate, async function(req, res) {
    
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
    var displayHistory = []
    db.collection('orders').aggregate([
        { "$match" : { "customerID" : userid } },
        { "$addFields": { "prodID": { "$toObjectId": "$productID" }}},
        { "$lookup": {
          "from": "products",
          "localField": "prodID",
          "foreignField": "_id",
          "as": "fromCart"
        }},
        {
            "$replaceRoot": { "newRoot": { "$mergeObjects": [ { "$arrayElemAt": [ "$fromCart", 0 ] }, "$$ROOT" ] } }
         },
         { "$project": { "fromCart": 0 } },{ "$group": { "_id": "$orderID",
         
         "total": { "$first": '$total' }, "status": { "$first": '$Status' },"createdAt": { "$first": '$createdAt' },
         "fromCart": { "$addToSet": "$$ROOT" }}},
         { "$sort": { "createdAt": -1}}
      ]).toArray(function(err, result) {
        if (err) throw err;

      
    
        displayHistory = result
        console.log(displayHistory)
        res.render('pages/history', {name: req.user.name,
            isLoggedIn: true, badgecart:badgeCart, transactions:displayHistory,phone:req.user.phone, address:req.user.address, zip:req.user.zip});
        })
});



module.exports = router

