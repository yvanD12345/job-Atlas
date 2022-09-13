const mongoose = require('./db.js');
const schema = new mongoose.Schema({
    Id_entreprise: Number,
	Nom_entreprise: String,
	Nom_recruteur: String,
	Email: String,
	Password: {
		type: String, set(val) {
			return require('bcrypt').hashSync(val, 10)
		}
	},

})


// pour l'acces dans les autres fichiers
const Employeurs = mongoose.model('Employeurs', schema);

module.exports=Employeurs