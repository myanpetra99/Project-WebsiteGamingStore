const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const Users = require('../models/user')
// Load User model

var auth = require('../middleware/Auth')

router.get('/login',auth.forwardAuthenticate, function(req, res) {
  res.render('pages/auth/login');
});

//register post
router.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));



//route register
router.get('/register',auth.forwardAuthenticate, function(req, res) {
  res.render('pages/auth/register');
});

//register post
router.post('/register',async (req,res) =>{
  const hashedPassword = await  bcrypt.hash(req.body.password, 10)
      let newUser = new Users({
          email : req.body.email,
          name: req.body.name,
          address : req.body.address,
          zip: req.body.zip,
          phone: req.body.phone,
          password: hashedPassword,
      })
      try{
        newUser.save()
      res.redirect('/login')
  }catch (e){
      res.redirect('/register')
      console.log(e)
  }
})

router.delete('/logout',(req,res)=>{
  req.logOut()
  res.redirect('/login')
})
module.exports = router;
