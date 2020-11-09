const express =  require('express')
const router = express.Router()
var auth = require('../../middleware/Auth')
var bodyParser = require('body-parser')
var fs = require('fs')
var path = require('path')
var authAdmin = require('../../middleware/isAdmin')
const Products = require('../../models/product')
const Brands = require('../../models/brand')
const crypto = require('crypto')
var multer = require('multer')
const mongoose = require('mongoose')
var asyncc = require('async')
const user = require('../../models/user')

var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
  
var upload = multer({ storage: storage }); 

var db = mongoose.connection;
router.get('/dashboard',auth.ensureAuthenticate, authAdmin.isAdmin('ADMIN'), function(req, res) {
    var prod 
    var br
    var u
    var ua
    var tasks = [
        function(callback) {
            db.collection('products').countDocuments().then((docs) =>{
               try{
                prod = docs
               }
               catch (e){
                console.log(e)
               }
               callback()
        })},
        function(callback) {
            db.collection('brands').countDocuments().then((docsbr) =>{
                try{
                    br = docsbr
                   }
                   catch (e){
                    console.log(e)
                   }
                   callback()
        })},
        function(callback) {
            db.collection('users').countDocuments({ role: 'USER'}).then((docsu) =>{
                try{
                    u = docsu
                   }
                   catch (e){
                    console.log(e)
                   }
                   callback()
        })},
        function(callback) {
            db.collection('users').countDocuments({ role: 'ADMIN'}).then((docsua) =>{
                try{
                    ua = docsua
                   }
                   catch (e){
                    console.log(e)
                   }
                   callback()
        })}

    ];

    asyncc.parallel(tasks, function(err) { //This function gets called after the two tasks have called their "task callbacks"
            if (err) return next(err); //If an error occurred, let express handle it by calling the `next` function
            // Here `locals` will be an object with `users` and `colors` keys
            // Example: `locals = {users: [...], colors: [...]}`
            res.render('pages/admin/dashboard', {name: req.user.name,
                isLoggedIn: true, manyProduct:prod, manyBrand:br, manyUser:u, manyAdmin:ua});
        });

   
});


//PRODUCT CRUD
router.get('/dashboard/product',auth.ensureAuthenticate, authAdmin.isAdmin('ADMIN'), async function(req, res) {
    const products = await Products.find()

    res.render('pages/admin/products/index', {name: req.user.name,
        isLoggedIn: true, products:products});
});

router.post('/dashboard/product/create',upload.single('image'), async (req,res,next)=>{
    req.product = new Products()
    next()
   },saveProductAndRedirect('create'))

router.get('/dashboard/product/create',auth.ensureAuthenticate, authAdmin.isAdmin('ADMIN'), function(req, res) {
    res.render('pages/admin/products/create', {name: req.user.name,
        isLoggedIn: true , product: new Products()});
});

router.put('/dashboard/product/:id/edit', async (req,res,next)=>{
req.product = await Products.findById(req.params.id)
next()
}, saveProductAndRedirect('edit'))

router.get('/dashboard/product/:id/edit',auth.ensureAuthenticate, authAdmin.isAdmin('ADMIN'), async function(req, res) {
    const product = await Products.findById(req.params.id)
    res.render('pages/admin/products/edit',{name: req.user.name,
        isLoggedIn: true ,product:product})
});

router.get('/dashboard/product/:slug',auth.ensureAuthenticate, authAdmin.isAdmin('ADMIN'), async (req,res)=>{
    const product = await Products.findOne({ slug: req.params.slug})
    if(product == null) res.redirect('dashboard/product')
    
    res.render('pages/admin/products/detail', {name: req.user.name,
        isLoggedIn: true, product:product});
})

router.delete('/dashboard/product/:id/delete', async (req, res)=>{
    await Products.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard/product')
})

//BRAND CRUD
router.get('/dashboard/product/brand/show',auth.ensureAuthenticate, authAdmin.isAdmin('ADMIN'), async function(req, res) {
    const brands = await Brands.find()

    res.render('pages/admin/brands/index', {name: req.user.name,
        isLoggedIn: true, brands:brands});
});

router.get('/dashboard/product/brand/create',auth.ensureAuthenticate,authAdmin.isAdmin('ADMIN'), function(req,res){
    res.render('pages/admin/brands/create', {name: req.user.name,
        isLoggedIn: true , brand: new Brands()});
})

router.post('/dashboard/product/brand/create',upload.single('image'), async (req,res,next)=>{
    req.brand = new Brands()
    next()
   },saveBrandAndRedirect('create'))
   
router.put('/dashboard/product/brand/:id/edit', async (req,res,next)=>{
    req.brand = await Brands.findById(req.params.id)
    next()
    }, saveBrandAndRedirect('edit'))

router.get('/dashboard/product/brand/:id/edit',auth.ensureAuthenticate, authAdmin.isAdmin('ADMIN'), async function(req, res) {
    const brand = await Brands.findById(req.params.id)
    res.render('pages/admin/brands/edit',{name: req.user.name,
    isLoggedIn: true ,brand:brand})
});

router.get('/dashboard/product/brand/:slug',auth.ensureAuthenticate, authAdmin.isAdmin('ADMIN'), async (req,res)=>{
    const brand = await Brands.findOne({ slug: req.params.slug})
    if(brand == null) res.redirect('dashboard/product/brand/show')
    
    res.render('pages/admin/brands/detail', {name: req.user.name,
        isLoggedIn: true, brand:brand});
})


router.delete('/dashboard/product/brand/:id/delete', async (req, res)=>{
    await Brands.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard/product/brand/show')
})


function saveProductAndRedirect(pathx){
    return async (req,res)=>{
       let product = req.product
            product.nama = req.body.nama
            product.sku = req.body.sku
            product.img.data = fs.readFileSync(path.join(__dirname + '/../../uploads/' + req.file.filename));
            product.img.contentType = 'image/png'
            product.price = req.body.price
            product.weight = req.body.weight
            product.desc = req.body.desc
            product.brand = req.body.brand
            product.category = req.body.category
    try{
       product = await product.save()
       res.redirect(`/dashboard/product/${product.slug}`)
    }catch (e){
        res.render(`pages/admin/products/${pathx}`,{name: req.user.name,
            isLoggedIn: true, product:product})
        console.log(e)
    }
    }
}

function saveBrandAndRedirect(pathy){
    return async (req,res)=>{
       let brand = req.brand
            brand.title = req.body.title
            brand.img.data = fs.readFileSync(path.join(__dirname + '/../../uploads/' + req.file.filename));
            brand.img.contentType = 'image/png'
    try{
        brand = await brand.save()
       res.redirect(`/dashboard/product/brand/${brand.slug}`)
    }catch (e){
        res.render(`pages/admin/brands/${pathy}`,{name: req.user.name,
            isLoggedIn: true, brand:brand})
        console.log(e)
    }
    }
}

module.exports = router