const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    
	Id_entreprise: Number,
	Nom_entreprise: String,
	Nom_recruteur: String,
	email: {
     type: String,
	 required:true,
	},
	password: {
		type: String,
		required:true,
	},

}, {timestamps: true});


// pour l'acces dans les autres fichiers
const Employeurs = mongoose.model('employeurs', schema);

module.exports=Employeurs