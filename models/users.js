

var mongoose = require('mongoose');

const schema = new mongoose.Schema ({
    password: String,
    email: String,
    user_type:{
        type:String,
        enum: ["etudiant", "employeur", "admin"],
		default: "etudiant",
        require: true,
    },
})

// pour l'acces dans les autres fichiers
const user = mongoose.model('users', schema);
module.exports= user