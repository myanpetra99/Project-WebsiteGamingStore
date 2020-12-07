const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var db = mongoose.connection;
var auth = require('../middleware/Auth')
const Users = require('../models/user')
const bcrypt = require('bcrypt');



router.get('/user',auth.ensureAuthenticate, async function(req, res) {

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
    res.render('pages/user', {
        name: req.user.name, 
        email : req.user.email,
        address : req.user.address,
        zip: req.user.zip,
        phone: req.user.phone,
        isLoggedIn: true, badgecart:badgeCart});
});

router.put('/user/update/password',  async function(req, res) {

    const userid = req.user.id
    const currentpassword = req.body.currentPassword
    const newpassword = await  bcrypt.hash(req.body.password, 10)
    Users.findOne({_id: userid}).then(user =>{
        bcrypt.compare(currentpassword, user.password, (err, isMatch, done) => {
            if (err) throw err;
            if (isMatch) {
               try {
                user.password = newpassword
                user.save()
                req.flash('success','new password has been updated!');
                res.redirect('/user')  
               } catch (error) {
                   console.log(error)
                   res.redirect('/')
               }
            } else {
                req.flash('error','wrong password!');
                res.redirect('/user')  
            }
          });
    })
});

router.put('/user/update',  async function(req, res) {

    const userid = req.user.id
    Users.findOne({_id: userid}).then(user =>{
      
               try {
                user.address = req.body.address,
                user.zip = req.body.zip,
                user.phone =req.body.telephone,
                user.save()
                req.flash('success','profile has been updated!');
                res.redirect('/user')  
               } catch (error) {
                   console.log(error)
                   res.redirect('/')
               }
           
          
    })
});

module.exports = router