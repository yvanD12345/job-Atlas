const mongoose = require('mongoose');
const schema = new mongoose.Schema ({
	Id_cv: Number,
	Id_etudiant_lie: Number
})

// pour l'acces dans les autres fichiers
const CVs = mongoose.model('CVs', schema);
module.exports=CVs