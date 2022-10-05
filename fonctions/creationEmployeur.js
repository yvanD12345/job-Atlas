const employeurs = require('../models/Employeur');
const users = require('../models/User');

 function creationProfilEmployeur(numero_entreprise, Nom_entreprise, Nom_recruteur, Email, Password) {

    const nouvelEmployeur = new employeurs({
        numero_entreprise: numero_entreprise,
        Nom_entreprise: Nom_entreprise,
        Nom_recruteur: Nom_recruteur,
        email: Email,
        password: Password,
        user_type: "employeur"
    })
    nouvelEmployeur.save()
    users.create({
        email: Email,
        password: Password,
        user_type: "employeur"
    })
    console.log("Un nouvel employeur a été créé");
    return nouvelEmployeur;

}

module.exports={
    creationProfilEmployeur:creationProfilEmployeur
}