const etudiants = require('../models/Etudiant');
const users = require('../models/User');


 function creationProfilEtudiant(DA_etudiant, Prenom, Nom_famille, Age, Email, Password) {


    const nouvelEtudiant = new etudiants({
        DA_etudiant: DA_etudiant,
        Prenom: Prenom,
        Nom_famille: Nom_famille,
        Age: 19,
        email: Email,
        password: Password,
        user_type: "etudiant"
    })
     nouvelEtudiant.save();
    users.create({
        user_type: "etudiant",
        password: Password,
        email: Email
    })
    console.log("Un nouvel étudiant a été créé");
    console.log(nouvelEtudiant._id)
    return nouvelEtudiant;
}


function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
}
function determinationAgeDateNaissance(dateNaissance) {
    dateNaissance = parseDate(dateNaissance)
    var ageDifference = Date.now() - dateNaissance.getTime();
    var ageDate = new Date(ageDifference);
    var ageEtudiant = Math.abs(ageDate.getUTCFullYear() - 1970);
    console.log("L'âge est de " + ageEtudiant)
    return ageEtudiant

}

module.exports={
    creationProfilEtudiant:creationProfilEtudiant
}