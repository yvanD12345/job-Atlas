
/* IMPORT DES MODULES */
const express = require('express');
const mongoose=require('mongoose')
const flash=require('express')
//GESTION DE SESSION
const session = require('express-session')
//ENCRYPTAGE DES MOTS DE PASSE
const bcrypt = require('bcryptjs')
//AUTHENTIFIER REQUÊTE
const passport = require('passport')
//permet de pouvoir utiliser des variables d'environnement en l'occurence celles contenu dans env
require("dotenv").config();

const methodeOverride = require('method-override')
/* DÉCLARATION DE VARIABLES */
const app=express();
const port=3000;
const mongoURL = 'mongodb://localhost:27017/JobAtlas_database'

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
app.use(methodeOverride('_method'))







/*ACCÈS AUX PAGES (GET) */
app.get('/', (req, res) => {
    res.render("Accueil");
});


app.get('/Connexion', (req, res) => {
    res.render("Connexion");
});


app.get('/Inscription', (req, res) => {
    res.render("Inscription");
});

app.get('/Profil', (req, res) => {
    res.render("Profil");
});


/*RÉSULTATS ENVOYÉS PAR LES PAGES (POST) */
 




// Connexion à MongoDB

mongoose.connect(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
//UNE FOIS LA CONNEXION AVEC LA BD ÉTABLIE, LE SERVEUR LISTEN
.then(() => {

    app.listen(port, () => {

        console.log("listening on port 3000");

    });

});



