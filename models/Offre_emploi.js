const mongoose = require('mongoose');
const OffreEmploischema = new mongoose.Schema ({
	Id_offre: Number,
	Id_employeur_lie: String,
    Titre_emploi: String,
    Description: String,
    Nbr_postes_vides: Number
})
//OffreEmploischema.index({"$**" : 'text'});

// pour l'acces dans les autres fichiers
const offre_emploi = mongoose.model('offre_emploi', OffreEmploischema);
module.exports= offre_emploi