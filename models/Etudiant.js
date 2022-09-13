const mongoose = require('./db.js');
const schema = new mongoose.Schema({
    Id_etudiant: Number,
	Prenom: String,
	Nom_famille: String,
    Age:Number,
	Email: String,
	Password: {
		type: String, set(val) {
			return require('bcrypt').hashSync(val, 10)
		}
	},

})


// pour l'acces dans les autres fichiers
const Etudiants = mongoose.model('Etudiants', schema);

module.exports=Etudiants