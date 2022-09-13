
/* IMPORT DES MODULES */
const express = require('express');
const mongoose=require('mongoose')
const flash=require('express')



/* DÉCLARATION DE VARIABLES */
const app=express();
const port=3000;


//gestion de session
const session = require('express-session')
//afficher des message 
const flash = require('express')








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













//ÉCOUTE DU SERVEUR
app.listen(port, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", port);

});

