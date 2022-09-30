const db = require('../connexion')
const Etudiant = require('../models/Etudiant')
const Employeur = require('../models/Employeur')
const fonctionsServer = require('../server')
const mockingoose = require('mockingoose');
beforeAll(async () => await db.connexion())
afterEach(async () => await db.effacerBD())
afterAll(async () => await db.deconnexionBD())

// Le describe sert à mettre les tests similaires ensemble dans un même endroit
//Ceci est un test régulier avec JEST
describe(' Tests Inscription étudiant', () => {
    it('inscription étudiant', async done => {
        const idEtudiant = await fonctionsServer.creationProfilEtudiant(1234, 'Samy', 'Sam', 18, 'samysam12@gmail.com', 'password123')
        const etudiant = await Etudiant.findById(idEtudiant)

        expect(etudiant.user_type).toBe('etudiant')
        expect(etudiant.DA_etudiant).toBe(1234)
        expect(etudiant.Prenom).toBe('Samy')
        expect(etudiant.Nom_famille).toBe('Sam')
        expect(etudiant.Age).toBe(18)
        expect(etudiant.email).toBe('samysam12@gmail.com')
        expect(etudiant.password).toBe('password123')

        done()
    })

})















//CECI EST UN TEST AVEC MOCKINGOOSE

/*

describe(' Tests Inscription employeur', () => {
    it('Test inscription employeur', async () => {
        mockingoose(Employeur).toReturn([
            {
                user_type: 'employeur',
                numero_entreprise: 123,
                Nom_entreprise: 'Apple',
                Nom_recruteur: 'Lisa Jobs',
                email: 'lisajobs@apple.com',
                password: 'password123'
            }

        ], 'find');
        const resultats = await fonctionsServer.creationProfilEmployeur();
        console.log(resultats.email)
        expect(resultats.user_type).toBe('employeur')
        expect(resultats.numero_entreprise).toBe(123)
        expect(resultats.Nom_entreprise).toBe('Apple')
        expect(resultats.Nom_recruteur).toBe('Lisa Jobs')
        expect(resultats.email).toBe('lisajobs@apple.com')
        expect(resultats.password).toBe('password123')

    })
})
*/