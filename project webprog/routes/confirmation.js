const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const mongoose = require('mongoose')
var db = mongoose.connection;
var multer = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

var upload = multer({ storage: storage })


router.get('/confirmation', async function(req, res) {
    if(req.isAuthenticated()){
     var badgeCart
     const userid = req.user.id
     await db.collection('carts').countDocuments({customerID:userid.toString()},{ limit: 999 }).then((docs) =>{
         try{
             badgeCart = docs
         }
         catch (e){
          console.log(e)
         }
     })
     res.render('pages/confirmation', {name: req.user.name,
         isLoggedIn: true, badgecart:badgeCart});
    }
    else{
     res.render('pages/confirmation', {isLoggedIn: false});
    }
 });
 
router.post('/confirmation/submit',upload.single('image'), async function(req, res){
 
    const order = await Order.findOne({orderID:req.body.nomororder})
 
     if(!order){
         console.log('id order tidak valid')
         req.flash('error','Id order tidak valid')
         return res.redirect('back');
     }
 
 
     req.confirmation = new Confirmations()
     let confirmation = req.confirmation
     confirmation.orderID = req.body.nomororder
     confirmation.userID = req.user.id.toString()
     confirmation.invoice.data = fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename))
     confirmation.invoice.contentType = 'image/png'
 
     try {
         confirmation.save()
         req.flash('success','Pembayaran telah kami terima, mohon di tunggu Konfirmasi')
         res.redirect('/confirmation')
     } catch (error) {
         console.log(error)
         res.redirect('/confirmation')
     }
 
 })
 
 module.exports = router