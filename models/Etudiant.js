const mongoose = require('mongoose');
const schema = new mongoose.Schema({
	user_type:String,
	Id_etudiant: Number,
	Prenom: String,
	Nom_famille: String,
    Age:Number,
	email: {
		type: String,
		required:true,
	   },
	   password: {
		   type: String,
		   required:true,
	   },
   

})


// pour l'acces dans les autres fichiers
const Etudiants = mongoose.model('etudiants', schema);

module.exports=Etudiants