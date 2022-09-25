

var mongoose = require('mongoose');

const schema = new mongoose.Schema ({
    password:  {
        type: String, set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    }, 
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