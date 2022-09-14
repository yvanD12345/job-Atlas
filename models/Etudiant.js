const mongoose = require('mongoose');
const Etduiantschema = new mongoose.Schema({
    Id_etudiant: Number,
	Prenom: String,
	Nom_famille: String,
    Age:Number,
	Email: String,
	Password: String 
	// {
	// 	type: String, set(val) {
	// 		return require('bcrypt').hashSync(val, 10)
	// 	}
	// },

})


// pour l'acces dans les autres fichiers
const Etudiants = mongoose.model('Etudiants', Etduiantschema);

module.exports=Etudiants