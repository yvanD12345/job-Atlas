
// jest.setTimeout(7500)
const db = require('../connexion')
const Etudiant = require('../models/Etudiant')
const Employeur = require('../models/Employeur')
const server = require('../server')
const mockingoose = require('mockingoose');
const experienceTravail = require('../models/ProfilProfessionel/experienceTravail');
const request = require("supertest")
const data = require('../views/resultSearch')

beforeAll(async () => await db.connexion())
afterEach(async () => await db.effacerBD())
afterAll(async () => await db.deconnexionBD())

// Le describe sert à mettre les tests similaires ensemble dans un même endroit
//Ceci est un test régulier avec JEST
describe('Inscription employeur', () => {
    it('Doit créer un employeur dans la base de données', async () => {
        const testUser= new Employeur({user_type:'employeur',numero_entreprise:1234567891,Nom_entreprise:'CGI',Nom_recruteur:'John agal',email:'johnagal@gmail.com',password:'CGI2022@'});
        const nouvelUser=server.creationProfilEmployeur(1234567891,'CGI','John agal','johnagal@gmail.com','CGI2022@');
        console.log(nouvelUser)
        console.log(testUser)
        expect((await nouvelUser).user_type).toBe(testUser.user_type);
        expect((await nouvelUser).numero_entreprise).toBe(testUser.numero_entreprise);
        expect((await nouvelUser).Nom_entreprise).toBe(testUser.Nom_entreprise);
        expect((await nouvelUser).Nom_recruteur).toBe(testUser.Nom_recruteur);
        expect((await nouvelUser).email).toBe(testUser.email);
    })
})
