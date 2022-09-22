const mongoose = require('mongoose');
const schema = new mongoose.Schema({

    Id_etudiant: Number,



})


// pour l'acces dans les autres fichiers
const ProfilPro = mongoose.model('profilPro', schema);

module.exports = ProfilPro