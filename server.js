const express = require('express');
const app = express();

// const emploiController = require('../service/emploiController');
const passport = require('passport');
const connection = require('./connexion');
const flash = require('express-flash');
const session = require("express-session");
const initializePassport = require("./passport_config");
const methodeOverride = require('method-override');
const {
    checkAuthenticated,
    checkNotAuthenticated,
} = require("./middlewares/auth");
var bodyParser = require('body-parser');
const pdfService = require('./service/pdf-service');
require("dotenv").config();


// IMPORT DES SCHÉMAS
const employeurs = require('./models/Employeur');
const users = require('./models/User');
const cvs = require('./models/cvs')
const etudiants = require('./models/Etudiant')
const profilPro = require('./models/ProfilPro')
const OffreEmploi = require('./models/Offre_emploi');
const user = require('./models/User');

//INITIALISATION VARIABLES
var titreSite = "JobAtlas";
let userCurrentlyLogged = null;
let checkifCvsIsNull = null;
var urlencoded = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();

initializePassport(
    passport,
    async (email) => {
        const userFound = await users.findOne({ email: email });

        return userFound;
    },
    async (id) => {
        const userFound = await users.findOne({ _id: id });
        return userFound;
    }
);

connection();





app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("images"));
app.use(flash());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUnitialized: false,
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(methodeOverride('_method'));
app.use(express.json());

//ACCÈS AUX PAGES
app.get('/Connexion', checkNotAuthenticated, (req, res) => {
    res.render('Connexion')
});
app.get('/Inscription', checkNotAuthenticated, (req, res) => {
    res.render('Inscription')
});
app.get('/Accueil', checkNotAuthenticated, (req, res) => {
    res.render('Accueil')
});
app.get('/creationcv', checkAuthenticated, (req, res) => {
    res.render('creationcv')
});
app.get('/affichercv', checkAuthenticated, (req, res) => {
    res.render('afficherCv')
});
app.get('/', (req, res) => {
    res.render('Accueil')
});
app.get('/header', checkAuthenticated, (req, res) => {
    res.render('header')
});

//PERMET DE DETERMINER QUI EST L'UTILISATEUR QUI EST PRÉSENTEMENT CONNECTER QUAND LE USER FAIT UN LOGIN
/*on store tous les user dans la bd user afin de faciliter la connection
une fois le user est connecter en tant que user on initialise la variarible usercurrentlylogged
avec un user dans la table du type de l'utilisateur qui connecter dans la bd user. bien sur on s'assura qu'il ne 
ne peux exister qu'un email est utilisable qu'une fois*/


app.get('/', checkAuthenticated, (req, res) => {
    cvs.find({ user_id: userCurrentlyLogged._id }, async function (err, Cvs) {
        if (userCurrentlyLogged.user_type == "etudiant") {
            //Cvs contiendra tous les cv que le user a deja fait 
            if (Cvs == null) {
                //bool qui determine si oui ou non il en a deja fait 
                checkifCvsIsNull = true;
                res.render("Profil", {
                    titrePage: titreSite,
                    titreSite: titreSite,
                    name: userCurrentlyLogged.Nom_famille +
                        " " +
                        userCurrentlyLogged.Prenom,
                    ConnectedUser: userCurrentlyLogged,
                    user_Cvs: Cvs,
                    checkCvs: checkifCvsIsNull,
                });
            }
            else {
                checkifCvsIsNull = false;
                res.render("Profil", {
                    titrePage: titreSite,
                    titreSite: titreSite,
                    name: userCurrentlyLogged.Nom_famille +
                        " " +
                        userCurrentlyLogged.Prenom,
                    ConnectedUser: userCurrentlyLogged,
                    user_Cvs: Cvs,
                    checkCvs: checkifCvsIsNull,
                });
            }
        }
    });
    if (userCurrentlyLogged.user_type == "employeur") {
        res.render("Profil", {
            titrePage: titreSite,
            titreSite: titreSite,
            name: userCurrentlyLogged.Nom_entreprise,
            ConnectedUser: userCurrentlyLogged,

        });
    }

});

app.get("/Profil", checkAuthenticated, (req, res) => {
    cvs.find({ user_id: userCurrentlyLogged._id }, async function (err, Cvs) {
        if (userCurrentlyLogged.user_type == "etudiant") {
            //Cvs contiendra tous les cv que le user a deja fait 
            if (Cvs == null) {
                //bool qui determine si oui ou non il en a deja fait 
                res.render("Profil", {
                    titrePage: titreSite,
                    titreSite: titreSite,
                    name: userCurrentlyLogged.Nom_famille +
                        " " +
                        userCurrentlyLogged.Prenom,
                    ConnectedUser: userCurrentlyLogged,
                    user_Cvs: Cvs,
                    checkCvs: checkifCvsIsNull,
                });
            }
            else {
                checkifCvsIsNull = false;
                res.render("Profil", {
                    titrePage: titreSite,
                    titreSite: titreSite,
                    name: userCurrentlyLogged.Nom_famille +
                        " " +
                        userCurrentlyLogged.Prenom,
                    ConnectedUser: userCurrentlyLogged,
                    user_Cvs: Cvs,
                    checkCvs: checkifCvsIsNull,
                });
            }
        }
    });

    if (userCurrentlyLogged.user_type == "employeur") {
        console.log(userCurrentlyLogged.email);
        res.render("Profil", {
            titrePage: titreSite,
            titreSite: titreSite,
            name: userCurrentlyLogged.Nom_entreprise,
            ConnectedUser: userCurrentlyLogged,

        });
    }

});

app.get('/informationsPersonnelles', checkAuthenticated, (req, res) => {

    if (userCurrentlyLogged.user_type == "etudiant") {
        //etudiantConnecte est l'objet retrouvé
        etudiants.findById(userCurrentlyLogged._id, function (err, etudiantConnecte) {
            if (err) throw err;
            console.log(etudiantConnecte)
            res.render('infosPersoEtudiant', { user: etudiantConnecte });
        })



    } else if (userCurrentlyLogged.user_type == "employeur") {
        console.log('Un employeur est connecte');
        employeurs.findById(userCurrentlyLogged._id, function (err, employeurConnecte) {
            if (err) throw err;
            console.log(employeurConnecte)
            res.render('infosPersoEmployeur', { user: employeurConnecte });
        })

    } else {
        res.redirect('/');
    }



});
async function saveUserLogged(req, res, next) {
    let userfound = null;
    const findone = await users.findOne({ email: req.body.email });
    if (findone) {
        if (findone.user_type == "etudiant") {
            userfound = await etudiants.findOne({ email: findone.email });
            if (userfound) {
                userCurrentlyLogged = userfound;

            }

        }
        else if (findone.user_type == "employeur") {
            userfound = await employeurs.findOne({ email: findone.email });
            if (userfound) {
                userCurrentlyLogged = userfound;
            }
        }
    }
    next();
}

/*RÉSULTATS ENVOYÉS PAR LES PAGES (POST) */
app.post('/Connexion', saveUserLogged, passport.authenticate('local', {
    successRedirect: '/Profil',
    failureRedirect: '/Connexion',
    failureFlash: true
}), async (req, res) => { });



app.post('/Inscription', urlencoded, checkNotAuthenticated, (req, res) => {
    var typeUser;

    if (req.body.EtudiantCheckBox == "Etudiant") {
        console.log("C'est un etudiant")
        typeUser = "etud"
        creationProfilEtudiant(req.body.id_etudiant, req.body.prenom_etudiant, req.body.nom_etudiant, req.body.date_naissance_etudiant, req.body.email_etudiant, req.body.mdp_etudiant, req.body.mdp_etudiant_scndfois);

    } else if (req.body.EmployeurCheckBox == "Employeur") {
        console.log("C'est un employé")
        typeUser = "emp"
        creationProfilEmployeur(req.body.id_employeur, req.body.nom_employeur, req.body.nom_recruteur, req.body.email_employeur, req.body.mdp_employeur, req.body.mdp_employeur_scndfois)

    }
    res.redirect('/');
});

//ajoute les infos entrer dans la bd sous un nouveau cv
app.post('/creationcv', checkAuthenticated, (req, res) => {
    cvs.create({
        title: req.body.title,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        user_id: userCurrentlyLogged._id
    });
    res.redirect('/');
});


//recois le cv choisi par le user envoie les infos afin de creer et afficher le cv
app.post('/affichercv', checkAuthenticated, async (req, res) => {

    const cvSelected = await cvs.findOne({ title: req.body.cv_selected });
    if (cvSelected != null) {
        pdfService.createCv(cvSelected, res);
    }
});
app.get("/search", (req, res) => {
    res.render('header');

});
/* app.post('/search', async (req, res) => {
    console.log('le search se fait')

    // try {
    let searchTerm = req.body.searchTerm;
   // OffreEmploi.findById('6331b70ac22ce0b6d4c02f53', function (err, emploi) {
    JobAtlas_database.offres_emplois.find("searchTerm", function (err, emploi){

        if (err) throw err;
        console.log(emploi)



    })

}); */

app.post('getOffreEmploi', async (req, res) => {
    let payload = req.body.payload.trim();
    let search = await offres_emplois.find({Titre_emploi: {$regex: new RegExp('^'+payload+ '.*', 'i')}}).exec();
    //resultat de recherche limité à 10
    search = search.slice(0, 10);
    res.sendFile({payload: search});
});

app.delete('/logout', (req, res) => {
    userCurrentlyLogged = null;
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");

    })

});





/* FONCTIONS UTILISÉES */

function creationProfilEtudiant(Id_etudiant, Prenom, Nom_famille, Age, Email, Password) {

    var nouvelEtudiant = { Id_etudiant: Id_etudiant, Prenom: Prenom, Nom_famille: Nom_famille, Age: Age, Password: Password };
    console.log(nouvelEtudiant)
    etudiants.create({
        Id_etudiant: Id_etudiant,
        Prenom: Prenom,
        Nom_famille: Nom_famille,
        Age: determinationAgeDateNaissance(Age),
        email: Email,
        password: Password,
        user_type: "etudiant"
    }, function (err) {
        if (err) throw err;
    })
    users.create({
        user_type: "etudiant",
        password: Password,
        email: Email
    })
    console.log("Un nouvel étudiant a été créé");
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

function creationProfilEmployeur(Id_entreprise, Nom_entreprise, Nom_recruteur, Email, Password) {
    var nouvelEmployeur = { Id_entreprise: Id_entreprise, Nom_entreprise: Nom_entreprise, Nom_recruteur: Nom_recruteur, Email: Email, Password: Password }
    console.log(nouvelEmployeur)
    employeurs.create({
        Id_entreprise: Id_entreprise,
        Nom_entreprise: Nom_entreprise,
        Nom_recruteur: Nom_recruteur,
        email: Email,
        password: Password,
        user_type: "employeur"
    }, function (err) {
        if (err) throw err;
    })
    users.create({
        email: Email,
        password: Password,
        user_type: "employeur"
    })
    console.log("Un nouvel employeur a été créé");
}



app.listen(3000);

