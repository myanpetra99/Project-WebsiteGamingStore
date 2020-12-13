// load the things we need
var express = require('express');
var app = express();
var passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
app.use(express.static("public"));
require('./passport-config')(passport);
app.use(flash())
app.use(session({
    secret: 'Secret',
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

var authRouter = require('./routes/auth')
var dashboardRouter = require('./routes/admin/dashboard')
var forgotRouter = require('./routes/forgot')
var productRouter = require('./routes/product')
var indexRouter = require('./routes/index')
var cartRouter = require('./routes/cart')
var historyRouter = require('./routes/history')
var userRouter = require('./routes/user')
var confirmationRouter = require('./routes/confirmation')
var aboutRouter = require('./routes/about')
var brandsRouter = require('./routes/brand')



mongoose.connect('mongodb+srv://admin:Admin123@agstore.zev78.mongodb.net/test', {
    useNewUrlParser:true , useUnifiedTopology:true, useCreateIndex:true
})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(forgotRouter)
app.use(cartRouter)
app.use(dashboardRouter)
app.use(productRouter)
app.use(indexRouter)
app.use(authRouter)
app.use(historyRouter)
app.use(userRouter)
app.use(confirmationRouter)
app.use(aboutRouter)
app.use(brandsRouter)


//404 Page

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
const port = process.env.PORT || 8080;

app.listen(port);