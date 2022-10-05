const users = require('../models/User');

function verificationUserExistant(email) {
    users.findOne({ email: email }, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            console.log('user exists')
            return true;
        } else {
            message = "user doesn't exist";
            return false;
        }
    });
}

module.exports={
    verificationUserExistant:verificationUserExistant
}