const mongoose = require('./db.js');
const schema = new mongoose.Schema ({
	Id_cv: number,
	Id_etudiant_lie: number
})

// pour l'acces dans les autres fichiers
const CVs = mongoose.model('CVs', schema);
module.exports=CVs