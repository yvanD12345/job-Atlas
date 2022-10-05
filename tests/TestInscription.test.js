
// jest.setTimeout(7500)
const db = require('../connexion')
const Etudiant = require('../models/Etudiant')
const Employeur = require('../models/Employeur')
const EtudiantMethodes = require('../fonctions/creationEtudiant')
const EmployeurMethodes = require('../fonctions/creationEmployeur')
const experienceTravail = require('../models/ProfilProfessionel/experienceTravail');
const request = require("supertest")

beforeAll(async () => await db.connexion())
afterEach(async () => await db.effacerBD())
afterAll(async () => await db.deconnexionBD())

// Le describe sert à mettre les tests similaires ensemble dans un même endroit
//Ceci est un test régulier avec JEST
describe('Inscription utilisateurs', () => {
    it('Doit créer un employeur dans la base de données', async () => {
        const testUser = new Employeur({ user_type: 'employeur', numero_entreprise: 1234567891, Nom_entreprise: 'CGI', Nom_recruteur: 'John agal', email: 'johnagal@gmail.com', password: 'CGI2022@' });
        const nouvelUser = EmployeurMethodes.creationProfilEmployeur(1234567891, 'CGI', 'John agal', 'johnagal@gmail.com', 'CGI2022@');
        console.log(nouvelUser)
        console.log(testUser)
        expect((await nouvelUser).user_type).toBe(testUser.user_type);
        expect((await nouvelUser).numero_entreprise).toBe(testUser.numero_entreprise);
        expect((await nouvelUser).Nom_entreprise).toBe(testUser.Nom_entreprise);
        expect((await nouvelUser).Nom_recruteur).toBe(testUser.Nom_recruteur);
        expect((await nouvelUser).email).toBe(testUser.email);

    })


    it('Doit créer un etudiant dans la base de données', async () => {
        const testUser = new Etudiant({ user_type: 'etudiant', DA_etudiant: 2061024, Prenom: 'Jad', Nom_famille: 'Kanil', Age: 19, email: 'jadkanil@gmail.com', password: 'Password123@' });
        const nouvelUser = EtudiantMethodes.creationProfilEtudiant(2061024,'Jad','Kanil',19,'jadkanil@gmail.com','Password123@');
        console.log(nouvelUser)
        console.log(testUser)
            expect((await nouvelUser).user_type).toBe(testUser.user_type);
            expect((await nouvelUser).DA_etudiant).toBe(testUser.DA_etudiant);
            expect((await nouvelUser).Prenom).toBe(testUser.Prenom);
            expect((await nouvelUser).Nom_famille).toBe(testUser.Nom_famille);
            expect((await nouvelUser).Age).toBe(testUser.Age);
            expect((await nouvelUser).email).toBe(testUser.email);

    })
})

