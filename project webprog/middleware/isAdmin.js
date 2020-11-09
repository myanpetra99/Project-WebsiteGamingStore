module.exports.isAdmin =  function isAdmin(role){
    return (req,res,next)=>{
        if(req.user.role !== role){
            res.status(401)
            return res.send('Not Allowed')
        }
        next()
    }
}