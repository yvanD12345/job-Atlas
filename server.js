//IMPORT FRAMEWORK
const express = require('express');
const app = express();
//AUTHENTIFIER REQUÊTE
const passport = require('passport');
//CONNECTION DE LA BD
const connection = require('./connexion');
const flash = require('express-flash');
//GESTION DE SESSION
const session = require("express-session");
const initializePassport = require("./passport_config");
const methodeOverride = require('method-override');
/*IMPORT DES SCHEMAS*/
const employeurs = require('./models/Employeur');
const users = require('./models/User');
const cvs = require('./models/cvs')
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const pdfService = require('./service/pdf-service');
const etudiants = require('./models/Etudiant')
const profilPro = require('./models/ProfilPro')
const OffreEmploi = require('./models/Offre_emploi');
//permet de pouvoir utiliser des variables d'environnement en l'occurence celles contenu dans env
require("dotenv").config();

//user présentement connecté
let userCurrentlyLogged = null;
let checkifCvsIsNull = null;

connection();

//INITIALISATION VARIABLE
var titreSite = "JobAtlas";




//CHECKAUTHENTICATED FAIT EN SORTE QUE L'ACTION GET OU SET N'EST FAISABLE QUE SI UN USER CONNECTER
/*EX: verifier si un utilisateur est connecter avec d'authoriser l'acces a la page Profil
CHECKNOTAUTHENTICATED FAIT EN SORTE QUE L'ACTION GET OU SET EST FAISABLE QUE SI UN USER CONNECTER
EX:verifier si un utilisateur est pas co avant de le laisser aller à la page de connexion ou
 inscription, car ca sert à rien de le laisser acceder à connexion si il est deja co
 */
const {
    checkAuthenticated,
    checkNotAuthenticated,
} = require("./middlewares/auth");


//SERS À INITIALISER LE PASSPORT
/*chaque fois qu'un utilisateur tentera de se connecter cette methode va prendre le 
passport qui est le middleware et aussi l'email qui va etre envoyer dans la requete
et chercher dans la bd user si il y a un user avec cet email et le reste de l'operation
va se derouler dans passport config
*/
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
// ACTIVE L'ACCÈS AUX PAGES EJS
app.set("view engine", "ejs");

// pour permettre le parsing des URLs
app.use(express.urlencoded({ extended: true}));
var urlencoded = bodyParser.urlencoded({extended:true});


// pour l'acces au dossier "public"
app.use(express.static("public"));

// pour l'acces au dossier "images"
app.use(express.static("images"));

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
app.use(methodeOverride('_method'));

app.get('/Connexion', checkNotAuthenticated, (req, res) => res.render('Connexion'));
app.get('/Inscription', checkNotAuthenticated, (req, res) => res.render('Inscription'));
app.get('/Acceuil',checkNotAuthenticated,(req,res)=> res.render('Acceuil'));
app.get('/creationcv',checkAuthenticated,(req,res) => res.render('creationcv'));
app.get('/affichercv',checkAuthenticated,(req,res) => res.render('/'));

//PERMET DE DETERMINER QUI EST L'UTILISATEUR QUI EST PRÉSENTEMENT CONNECTER QUAND LE USER FAIT UN LOGIN
/*on store tous les user dans la bd user afin de faciliter la connection
une fois le user est connecter en tant que user on initialise la variarible usercurrentlylogged
avec un user dans la table du type de l'utilisateur qui connecter dans la bd user. bien sur on s'assura qu'il ne 
ne peux exister qu'un email est utilisable qu'une fois*/
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

app.get('/',checkAuthenticated,(req, res) => {
    cvs.find({ user_id: userCurrentlyLogged._id }, async function (err, Cvs) {
        if(userCurrentlyLogged.user_type == "etudiant"){
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
        if(userCurrentlyLogged.user_type == "employeur"){
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
        if(userCurrentlyLogged.user_type == "etudiant"){
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
                name: userCurrentlyLogged.Nom_famille+
                    " " +
                    userCurrentlyLogged.Prenom,
                ConnectedUser: userCurrentlyLogged,
                user_Cvs: Cvs,
                checkCvs: checkifCvsIsNull,
            });
        }
        }
    });
        
        if(userCurrentlyLogged.user_type == "employeur"){
            console.log(userCurrentlyLogged.email);
            res.render("Profil", {
                titrePage: titreSite,
                titreSite: titreSite,
                name: userCurrentlyLogged.Nom_entreprise,
                ConnectedUser: userCurrentlyLogged,
                
            });
        }
    
});

app.post('/Connexion', saveUserLogged, passport.authenticate('local', {
    successRedirect: '/Profil',
    failureRedirect: '/Connexion',
    failureFlash: true
}),async (req,res) => { });


/*RÉSULTATS ENVOYÉS PAR LES PAGES (POST) */
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



app.delete('/logout', (req, res) => {
    userCurrentlyLogged = null;
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");

    })

});


/* FONCTIONS UTILISÉES */
function creationProfilEtudiant(Id_etudiant, Prenom, Nom_famille, Age, Email,Password) {

    var nouvelEtudiant={Id_etudiant:Id_etudiant,Prenom:Prenom,Nom_famille:Nom_famille, Age:Age, Password:Password };
    console.log(nouvelEtudiant)
    etudiants.create({
        Id_etudiant: Id_etudiant,
        Prenom: Prenom,
        Nom_famille: Nom_famille,
        Age: determinationAgeDateNaissance(Age),
        Password: Password,
        email: Email
    }, function (err) {
        if (err) throw err;
    })
    etudiants.create({
        user_type:"etudiant",
        password: Password,
        email: Email
    })
    console.log("Un nouvel étudiant a été créé");
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
    employeurs.create({
        Id_entreprise: Id_entreprise,
        Nom_entreprise: Nom_entreprise,
        Nom_recruteur: Nom_recruteur,
        email: Email,
        password: Password,
        user_type : "employeur"
    }, function (err) {
        if (err) throw err;
    })
    users.create({
        email: Email,
        password: Password,
        user_type : "employeur"
    })
    console.log("Un nouvel employeur a été créé");
}

//ajoute les infos entrer dans la bd sous un nouveau cv
app.post('/creationcv',checkAuthenticated,(req,res) =>{
    cvs.create({
        title: req.body.title,
        first_name: req.body.firstname,
        last_name:req.body.lastname,
        email:req.body.email,
        user_id:userCurrentlyLogged._id
    });
 res.redirect('/');
});


//recois le cv choisi par le user envoie les infos afin de creer et afficher le cv
app.post('/affichercv',checkAuthenticated,async (req,res) =>{

  const cvSelected = await cvs.findOne({title:req.body.cv_selected});
  if(cvSelected != null){
    pdfService.createCv(cvSelected,res);
  }
  });

app.listen(3000);

