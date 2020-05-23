function adminAuth(req, res, next){
    if(req.session.user != undefined && req.session.user.status == 2){
        next();
    }else {
        res.redirect('/login');
    }
     
   
}

module.exports = adminAuth;