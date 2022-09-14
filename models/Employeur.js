const mongoose = require('mongoose');

const EmployeurSchema = new mongoose.Schema({
    Id_entreprise: Number,
	Nom_entreprise: String,
	Nom_recruteur: String,
	Email: String,
	 Password: String
	//{
	// 	type: String, set(val) {
	// 		return require('bcrypt').hashSync(val, 10)
	// 	}
	// },

}, {timestamps: true});


// pour l'acces dans les autres fichiers
const Employeurs=mongoose.model('Employeurs', EmployeurSchema);

module.exports=Employeurs