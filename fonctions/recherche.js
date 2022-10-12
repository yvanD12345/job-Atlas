const Offre_Emploi = require('../models/Offre_emploi');


async function rechercheMotCle(searchTerm) {
    const regex = new RegExp(escapeRegex(searchTerm), 'gi');
    let resultatDeRecherche =  await Offre_Emploi.find({ Titre_emploi: regex }).exec()
    return resultatDeRecherche
}



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = {
    rechercheMotCle: rechercheMotCle

}