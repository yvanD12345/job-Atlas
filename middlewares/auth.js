

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){

        return next()
    }
    res.redirect('Connexion')
}
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated() ){
        //checknot good
   return res.redirect('/Profil')
    }
    next()
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
};