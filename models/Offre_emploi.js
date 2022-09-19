const mongoose = require('mongoose');
const OffreEmploischema = new mongoose.Schema ({
	Id_offre: Number,
	Id_employeur_lie: String,
    Description: String,
    Nbr_postes_vides: Number
})

// pour l'acces dans les autres fichiers
const offres_emploi = mongoose.model('offres_emploi', OffreEmploischema);
module.exports= offres_emploi