



module.exports.ensureAuthenticate = function ensureAuthenticate (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login') // if not auth
  }


module.exports.forwardAuthenticate = function forwardAuthenticate (req, res, next)  {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('back');  // if auth
}