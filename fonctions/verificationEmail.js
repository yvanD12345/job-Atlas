const users = require('../models/User');

function verificationUserExistant(email) {
    var userRecherche= users.findOne({ email: email}).exec();
   
        if (userRecherche.email.length>0) {
            console.log('user exists')
            return true;
        } else {
            message = "user doesn't exist";
            return false;
        }
    }


module.exports={
    verificationUserExistant:verificationUserExistant
}