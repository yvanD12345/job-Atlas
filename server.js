const express = require('express');
const app = express();
const db = require('./connexion')
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
const etudiants = require('./models/Etudiant');
const profilPro = require('./models/ProfilPro')
const OffreEmploi = require('./models/Offre_emploi');
const user = require('./models/User');

//Import des fonctions
const Etudiant = require('./fonctions/creationEtudiant');
const VerifierEmail = require('./fonctions/verificationEmail');
const Employeur = require('./fonctions/creationEmployeur');
const rechercheMotCle = require('./fonctions/recherche');


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

db.connexion();





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
app.get('/ProfilProfessionnel', checkAuthenticated, (req, res) => {
    res.render('ProfilProfessionnel')
});
app.get('/affichercv', checkAuthenticated, (req, res) => {
    res.render('afficherCv')
});

app.get('/', (req, res) => {
    res.render('Accueil')
});
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + './views/Accueil.ejs');
// });
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
    var email = req.body.email;
    if (VerifierEmail.verificationUserExistant(email) == false) {
        console.log('user existe deja')
    }
    else {
        if (req.body.EtudiantCheckBox == "Etudiant") {
            console.log("C'est un etudiant")
            Etudiant.creationProfilEtudiant(req.body.DA_etudiant, req.body.prenom_etudiant, req.body.nom_etudiant, req.body.date_naissance_etudiant, req.body.email, req.body.mdp);
        } else if (req.body.EmployeurCheckBox == "Employeur") {
            console.log("C'est un employé")
            Employeur.creationProfilEmployeur(req.body.id_employeur, req.body.nom_employeur, req.body.nom_recruteur, req.body.email, req.body.mdp);
        }
    }
    res.redirect('/');
});

//ajoute les infos entrer dans la bd sous un nouveau cv
app.post('/ProfilProfessionnel', checkAuthenticated, (req, res) => {
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
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.post('/search', async (req, res) => {
    console.log('le search se fait') 
    rsltTrouves = await rechercheMotCle.rechercheMotCle(req.body.searchTerm);
    console.log(rsltTrouves)


    res.render("resultSearch", { rsltTrouves: rsltTrouves });

});


app.post('getOffreEmploi', async (req, res) => {
    let payload = req.body.payload.trim();
    let search = await offres_emplois.find({ Titre_emploi: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
    //resultat de recherche limité à 10
    search = search.slice(0, 10);
    res.sendFile({ payload: search });
});

app.delete('/logout', (req, res) => {
    userCurrentlyLogged = null;
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");

    })

});













app.listen(3000);

