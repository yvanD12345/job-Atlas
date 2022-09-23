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
require("dotenv").config();


let userCurrentlyLogged = null;
let checkifCvsIsNull = null;



var titreSite = "JobAtlas";


connection();



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
app.use(express.urlencoded({ extended: true }));
var urlencoded = bodyParser.urlencoded({ extended: true });


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

app.get('/', checkAuthenticated, (req, res) => res.render("Profil"));

app.get('/creationcv', checkAuthenticated, (req, res) => res.render('creationcv'));


app.get("/homepage", checkNotAuthenticated, (req, res) => {

    //    const checkifCvsIsNull = true;
    res.render("homepage", {
        titrePage: titreSite,
        titreSite: titreSite,
        /*  name: userCurrentlyLogged.first_name +
              " " +
              userCurrentlyLogged.last_name,
              */
        ConnectedUser: userCurrentlyLogged,
        // user_Cvs: Cvs,
        //  checkCvs: checkifCvsIsNull,

    });
});
app.get('/Connexion', checkNotAuthenticated, (req, res) => res.render('Connexion'));
app.get('/Inscription', checkNotAuthenticated, (req, res) => res.render('Inscription'));
app.get('/Acceuil', checkNotAuthenticated, (req, res) => res.render('Acceuil'));
app.get('/creationcv', checkAuthenticated, (req, res) => res.render('creationcv'));
app.get('/affichercv', checkAuthenticated, (req, res) => res.render('/'));

/*ACCÈS AUX PAGES (GET) */
app.get('/', (req, res) => {
    res.render("Accueil");
});

app.post('/Connexion', saveUserLogged, passport.authenticate('local', {
    successRedirect: '/Profil',
    failureRedirect: 'Connexion',
    failureFlash: true
}));


/*RÉSULTATS ENVOYÉS PAR LES PAGES (POST) */
app.post('/Inscription', checkNotAuthenticated, (req, res) => {
    var typeUser;

    if (req.body.EtudiantCheckBox == "Etudiant") {
        console.log("C'est un etudiant")
        typeUser = "etud"
        creationProfilEtudiant(req.body.id_etudiant, req.body.prenom_etudiant, req.body.nom_etudiant, req.body.date_naissance_etudiant, req.body.email_etudiant, req.body.mdp_etudiant, req.body.mdp_etudiant_scndfois);
        res.redirect('/Profil')
    } else if (req.body.EmployeurCheckBox == "Employeur") {
        console.log("C'est un employé")
        typeUser = "emp"
        creationProfilEmployeur(req.body.id_employeur, req.body.nom_employeur, req.body.nom_recruteur, req.body.email_employeur, req.body.mdp_employeur, req.body.mdp_employeur_scndfois)
        res.redirect('/Profil')
    }
});


app.delete('/logout', (req, res) => {
    userCurrentlyLogged = null;
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");

    })

});





/*ACCÈS AUX PAGES (GET) */
app.get('/', (req, res) => {
    res.render("Accueil");
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

    app.post('/Connexion', saveUserLogged, passport.authenticate('local', {
        successRedirect: '/Profil',
        failureRedirect: '/Connexion',
        failureFlash: true
    }), async (req, res) => { });


    /*RÉSULTATS ENVOYÉS PAR LES PAGES (POST) */
    app.post('/Inscription', checkNotAuthenticated, (req, res) => {

        app.get('/Profil', checkAuthenticated, (req, res) => {

            if (userCurrentlyLogged.user_type == "etudiant") {

                Cvs.find({ user_id: userCurrentlyLogged._id }, function (err, Cvs) {
                    if (Cvs == null) {
                        const checkifCvsIsNull = true;
                        res.render("Profil", {
                            titrePage: titreSite,
                            titreSite: titreSite,
                            name: userCurrentlyLogged.first_name +
                                " " +
                                userCurrentlyLogged.last_name,
                            ConnectedUser: userCurrentlyLogged,
                            user_Cvs: Cvs,
                            checkCvs: checkifCvsIsNull,

                        });
                    }
                    else {
                        const checkifCvsIsNull = false;
                        res.render("Profil", {
                            titrePage: titreSite,
                            titreSite: titreSite,
                            name: userCurrentlyLogged.first_name +
                                " " +
                                userCurrentlyLogged.last_name,
                            ConnectedUser: userCurrentlyLogged,
                            user_Cvs: Cvs,

                            checkCvs: checkifCvsIsNull,

                        });
                    }

                });
            } else if (userCurrentlyLogged.user_type == "employeur") {
                res.render("Profil", {
                    titrePage: titreSite,
                    titreSite: titreSite,
                    name: userCurrentlyLogged.Nom_entreprise,
                    ConnectedUser: userCurrentlyLogged,


                })

            }


        });

        app.get('/header', (req, res) => {
            res.render("header");
        });

        app.post('/Connexion', saveUserLogged, passport.authenticate('local', {
            successRedirect: '/Profil',
            failureRedirect: 'Connexion',
            failureFlash: true
        }))



        app.post("/creationcv", checkAuthenticated,
            async (req, res) => {
                Cvs.create({
                    first_name: req.body.firstname,
                    last_name: req.body.lastname,
                    email: req.body.email,
                    user_id: userCurrentlyLogged._id,
                    title: "test",

                });
                res.redirect('/');
            });
        app.post("/afficherCv", checkAuthenticated, async (req, res) => {
            const cvSelected = Cvs.findOne(req.body.cv_selected);
            console.log(cvSelected.title);
            if (cvSelected) {
                console.log("cmoi wsh");
                PDFService.createCv(cvSelected, res);
            }
        });



        app.delete('/logout', (req, res) => {
            userCurrentlyLogged = null;
            req.logout(req.user, err => {
                if (err) return next(err);
                res.redirect("/");

            })


            /*RÉSULTATS ENVOYÉS PAR LES PAGES (POST) */
            //Wafi quand tu va faire inscription ajoute dans la bd user le password l'email et le type de l'etudiant qui sera creer jl deja fait pour 
            //Employeur. La bd user rend la connexion plus simple merci. si tu va dans creer emplooyeur j'ai fait un exemple tu px juste copy coller
            app.post('/Register', checkNotAuthenticated, (req, res) => {

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

                app.listen(3000);

