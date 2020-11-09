// load the things we need
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


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

app.use(dashboardRouter)


mongoose.connect('mongodb://127.0.0.1/Agstore', {
    useNewUrlParser:true , useUnifiedTopology:true, useCreateIndex:true
})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//models product


//fake local db

//dummy data product
app.locals.productdata = require('./data.json')


//for Login




//PUBLIC SECTION
//route index
app.get('/', auth.softAuthenticate, function(req, res) {
    res.render('pages/index',
    {name: req.user.name,
        isLoggedIn: true});
});


//route product
app.get('/product', auth.softAuthenticate, function(req, res) {
    res.render('pages/product',
    {name: req.user.name,
        isLoggedIn: true});
});

//route item
app.get('/item', auth.softAuthenticate, function(req, res) {
    res.render('pages/item',
    {name: req.user.name,
        isLoggedIn: true});
});


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
app.get('/about',auth.softAuthenticate, function(req, res) {
    res.render('pages/about', {name: req.user.name,
        isLoggedIn: true});
});
//route confirmation
app.get('/confirmation',auth.softAuthenticate, function(req, res) {
    res.render('pages/confirmation', {name: req.user.name,
        isLoggedIn: true});
});

//route cart
app.get('/cart',auth.ensureAuthenticate, function(req, res) {
    res.render('pages/cart', {name: req.user.name,
        isLoggedIn: true});
});

//route buy-now
app.get('/buy-now',auth.ensureAuthenticate, function(req, res) {
    res.render('pages/buy-now', {name: req.user.name,
        isLoggedIn: true});
});




//route user
app.get('/user',auth.ensureAuthenticate, function(req, res) {
    res.render('pages/user', {
        name: req.user.name, 
        email : req.user.email,
        address : req.user.address,
        zip: req.user.zip,
        phone: req.user.phone,
        isLoggedIn: true});
});

//route history
app.get('/history',auth.ensureAuthenticate, function(req, res) {
    res.render('pages/history', {name: req.user.name,
        isLoggedIn: true});
});

//POST delete Login (logout)
app.delete('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/login')
})
//------------PUBLIC SECTION END


//Middleware



//Localhost and port
const hostname = '127.0.0.1';
const port = 8080;

app.listen(8080);
console.log(`Server running at http://${hostname}:${port}/`);