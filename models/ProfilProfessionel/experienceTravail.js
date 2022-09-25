const mongoose = require('mongoose');
const schema = new mongoose.Schema({
	titre_poste: {
		type: String,
		required: true,
	},
	nom_compagnie:{
		type: String,
		required: true,
	},
	date_debut: {
		type: Date,
		required: true,
	},
	date_fin: {
		type: Date,
		required: true,
	}

})


// pour l'acces dans les autres fichiers
const experienceTravail = mongoose.model('experienceTravail', schema);

module.exports = experienceTravail