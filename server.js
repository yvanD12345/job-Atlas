
/* IMPORT DES MODULES */
const express = require('express');
const mongoose = require('mongoose')
const flash = require('express')
const methodeOverride = require('method-override')
const bodyParser = require('body-parser');
//GESTION DE SESSION
const session = require('express-session')
//ENCRYPTAGE DES MOTS DE PASSE
const bcrypt = require('bcryptjs')
//AUTHENTIFIER REQUÊTE
const passport = require('passport')
//permet de pouvoir utiliser des variables d'environnement en l'occurence celles contenu dans env
require("dotenv").config();
/* DÉCLARATION DES MODULES */
const CVs = require('./models/CV');
const Employeurs = require('./models/Employeur');
const Etudiants = require('./models/Etudiant');
const OffresEmploi = require('./models/Offre_emploi');

/* DÉCLARATION DE VARIABLES */
const app = express();
const port = 3000;
const mongoURL = 'mongodb://localhost:27017/JobAtlas_database'
//mongodb://localhost:27017/JobAtlas_database


var urlencodeParser = bodyParser.urlencoded({ extended: true });
// ACTIVE L'ACCÈS AUX PAGES EJS
app.set("view engine", "ejs");

// pour permettre le parsing des URLs
app.use(express.urlencoded({ extended: true }));

// pour l'acces au dossier "public"
app.use(express.static("public"));

// pour l'acces au dossier "images"
app.use(express.static("images"));

// pour activer le module express-flash
app.use(flash());

//initialise les données unique de l'utilisateur
//qui nous aiderons a tracer ce que l'utlisateur va faire
app.use(
    session({
        /*sers pour se connecter et/ ou encrypter les 
        cookies envoyer par le site.
        session is a environement variable le fait d'assigner le parametre 
        secret authorise express session de l'utiliser pour
        encrypter l'id de la session*/
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUnitialized: false,
    })
)

app.use(passport.initialize())

/*agis comme un middlware qui modifie l'objet de la requete
et la valeur de l'utilisateur pour le bon deserylised user*/
app.use(passport.session())

/* permet a la requete http d'utiliser des verbes
tels que put or delete là ou certain user pourrait
ne pas le supporter ca aide notament pour la deconnexion 
d'un user
*/








/*ACCÈS AUX PAGES (GET) */
app.get('/', (req, res) => {
    res.render("Accueil");
});


app.get('/Connexion', (req, res) => {
    res.render("Connexion");
});


app.get('/Inscription', (req, res) => {
    console.log("le get se fait")
    res.render("Inscription");
});

app.get('/Profil', (req, res) => {
    res.render("Profil");
});


/*RÉSULTATS ENVOYÉS PAR LES PAGES (POST) */
app.post('/Inscription', urlencodeParser, (req, res) => {
    var typeUser;

    if (req.body.EtudiantCheckBox=="Etudiant") {
        console.log("C'est un etudiant")
        typeUser = "etud"
        creationProfilEtudiant(req.body.id_etudiant, req.body.prenom_etudiant, req.body.nom_etudiant, req.body.date_naissance_etudiant, req.body.email_etudiant, req.body.mdp_etudiant, req.body.mdp_etudiant_scndfois);
 
    } else if (req.body.EmployeurCheckBox=="Employeur") {
        console.log("C'est un employé")
        typeUser = "emp"
        creationProfilEmployeur(req.body.id_employeur, req.body.nom_employeur, req.body.nom_recruteur, req.body.email_employeur, req.body.mdp_employeur, req.body.mdp_employeur_scndfois)
        
    }


});


// Connexion à MongoDB

mongoose.connect(mongoURL, (err) =>{

    if(!err) console.log('db connected');
    else console.log('db error');
})



app.listen(port, () => {console.log("listening on port 3000")});

/* FONCTIONS UTILISÉES */
function creationProfilEtudiant(Id_etudiant, Prenom, Nom_famille, Age, Password) {

    var nouvelEtudiant={Id_etudiant:Id_etudiant,Prenom:Prenom,Nom_famille:Nom_famille, Age:Age, Password:Password };
    console.log(nouvelEtudiant)
    Etudiants.create({
        Id_etudiant: Id_etudiant,
        Prenom: Prenom,
        Nom_famille: Nom_famille,
        Age: determinationAgeDateNaissance(Age),
        Password: Password

    }, function (err) {
        if (err) throw err;
    })
    console.log("Un nouvel étudiant a été créé")
}

function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
  }
function determinationAgeDateNaissance(dateNaissance){
    dateNaissance=parseDate(dateNaissance)
    var ageDifference = Date.now() - dateNaissance.getTime();
    var ageDate = new Date(ageDifference);
    var ageEtudiant=Math.abs(ageDate.getUTCFullYear() - 1970);
    console.log("L'âge est de "+ageEtudiant)
    return ageEtudiant

}

function creationProfilEmployeur(Id_entreprise, Nom_entreprise, Nom_recruteur, Email, Password) {
    var nouvelEmployeur={Id_entreprise:Id_entreprise, Nom_entreprise:Nom_entreprise, Nom_recruteur:Nom_recruteur, Email:Email, Password:Password}
    console.log(nouvelEmployeur)
    Employeurs.create({
        Id_entreprise: Id_entreprise,
        Nom_entreprise: Nom_entreprise,
        Nom_recruteur: Nom_recruteur,
        Email: Email,
        Password: Password

    }, function (err) {
        if (err) throw err;
    })
    console.log("Un nouvel employeur a été créé")
}