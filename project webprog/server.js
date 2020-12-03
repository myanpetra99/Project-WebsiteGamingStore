// load the things we need
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

var ObjectID = require('mongodb').ObjectID
var express = require('express');
var path = require('path');
var app = express();
var bcrypt = require('bcrypt')
var passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
app.use(express.static("public"));
require('./passport-config')(passport);
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : false}))
app.use(express.json())
//---------------------------------------------------

const Users = require('./models/user')
var auth = require('./middleware/Auth')
var dashboardRouter = require('./routes/admin/dashboard')
var forgotRouter = require('./routes/forgot')
const Products = require('./models/product')
const Galleries = require('./models/gallery')
const Cart = require('./models/cart');
const Categories = require('./models/category');
const Brands = require('./models/brand');
const user = require('./models/user');
const Comment = require('./models/comment')
const Subcomment = require('./models/subcomment')
const Order = require('./models/order')
const Carousels = require('./models/carousel')
const Confirmations = require('./models/confirmation')
var fs = require('fs')
var multer = require('multer')


app.use(forgotRouter)
app.use(dashboardRouter)


mongoose.connect('mongodb://127.0.0.1/Agstore', {
    useNewUrlParser:true , useUnifiedTopology:true, useCreateIndex:true
})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//PUBLIC SECTION
//route index

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

  var upload = multer({ storage: storage })

app.get('/', async function(req, res) {
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


//route product
app.get('/product', async function(req, res) {
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

app.get('/product/item/:slug', async (req,res)=>{
  
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


app.post('/product/item/:slug/comment', async(req,res)=>{

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

app.post('/product/item/:slug/:id/subcomment', async(req,res)=>{

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


//route login
app.get('/login',auth.forwardAuthenticate, function(req, res) {
    res.render('pages/auth/login');
});

//register post
app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));



//route register
app.get('/register',auth.forwardAuthenticate, function(req, res) {
    res.render('pages/auth/register');
});

//register post
app.post('/register',async (req,res) =>{
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




//route about
app.get('/about', async function(req, res) {
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
//route confirmation
app.get('/confirmation', async function(req, res) {
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

app.post('/confirmation/submit',upload.single('image'), async function(req, res){

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

//route cart
app.get('/cart',auth.ensureAuthenticate, async function(req, res) {

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


app.delete('/cart/:id/delete', async (req, res)=>{
    await Cart.findByIdAndDelete(req.params.id)

    res.redirect('/cart')
})


//route user
app.get('/user',auth.ensureAuthenticate, async function(req, res) {

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

app.put('/user/update/password',  async function(req, res) {

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

app.put('/user/update',  async function(req, res) {

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

//route history
app.get('/history',auth.ensureAuthenticate, async function(req, res) {
    
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

//POST delete Login (logout)
app.delete('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/login')
})
//------------PUBLIC SECTION END

//Add to cart
app.post('/add-to-cart/:id', async (req,res,next) =>{
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


app.post('/cart/:id/increase', async (req,res,next) =>{

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

app.post('/cart/:id/decrease', async (req,res,next) =>{

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

//Instant Cart

//route buy-now

app.get('/buy-now/:slug', async (req,res)=>{
    
    const product = await Products.findOne({ slug: req.params.slug})
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
    
    if(product == null){ res.redirect('/product')}
    
    if(req.isAuthenticated()){
        res.render('pages/buy-now', {name: req.user.name,
            isLoggedIn: true, product:product,badgecart:badgeCart,phone:req.user.phone, address:req.user.address, zip:req.user.zip});
    }   
    else{
        res.redirect('/login')
    }
})


app.post('/buy-now/:slug/checkout', async (req,res,next)=>{
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



app.post('/cart/checkout', async (req,res,next)=>{
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


app.use( async function(req, res, next) {
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
        res.render('pages/404page',
    {name: req.user.name,
        isLoggedIn: true, badgecart:badgeCart});
    }else{
        res.render('pages/404page',
    {isLoggedIn: false});
    }
});
//Localhost and port
const hostname = '127.0.0.1';
const port = 8080;

app.listen(8080);
console.log(`Server running at http://${hostname}:${port}/`);