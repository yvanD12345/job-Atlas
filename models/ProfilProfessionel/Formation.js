const mongoose = require('mongoose');
const schema = new mongoose.Schema({
	nom_ecole: {
		type: String,
		required: true,
	},
	date_diplome:{
		type: Date,
		required: true,
	},
	domaine_expertise: {
		type: String,
		required: true,
	},

})


// pour l'acces dans les autres fichiers
const formation = mongoose.model('formation', schema);

module.exports = formation