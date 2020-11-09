



module.exports.ensureAuthenticate = function ensureAuthenticate (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login') // if not auth
  }

  module.exports.softAuthenticate = function softAuthenticate(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
if(req.route.path == '/'){
    res.render('pages/index',
    {isLoggedIn: false})
}

if(req.route.path == '/product'){
    res.render('pages/product',
    {isLoggedIn: false})
}

if(req.route.path == '/item'){
    res.render('pages/item',
    {isLoggedIn: false})
}

if(req.route.path == '/about'){
    res.render('pages/about',
    {isLoggedIn: false})
}
if(req.route.path == '/confirmation'){
    res.render('pages/confirmation',
    {isLoggedIn: false})
}
}

module.exports.forwardAuthenticate = function forwardAuthenticate (req, res, next)  {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('back');  // if auth
}