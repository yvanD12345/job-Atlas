const db = require('../connexion')
const Etudiant = require('../models/Etudiant')
const Employeur = require('../models/Employeur')
const fonctionsServer = require('../server')
beforeAll(async () => await db.connexion())
afterEach(async () => await db.effacerBD())
afterAll(async () => await db.deconnexionBD())

// Le describe sert à mettre les tests similaires ensemble dans un même endroit
describe(' Tests Inscription étudiant', () => {


    it('inscription étudiant', async done => {
        const { idEtudiant } = await fonctionsServer.creationProfilEtudiant(1234, 'Samy', 'Sam', 18, 'samysam12@gmail.com', 'password123')
        const etudiant = await Etudiant.findById(idEtudiant)
        expect(etudiant.Id_etudiant).toEqual(1234)
        expect(etudiant.Prenom).toEqual('Samy')
        expect(etudiant.Nom_famille).toEqual('Sam')
        expect(etudiant.Age).toEqual(18)
        expect(etudiant.email).toEqual('samysam12@gmail.com')
        expect(etudiant.password).toEqual('password123')

        done()
    })

})

describe(' Tests Inscription étudiant', () => {
    it('Test inscription employeur', async done => {
        const { idEmployeur } = await fonctionsServer.creationProfilEmployeur(1234, 'Apple', 'Mark Girson', 'markgirson@apple.com', 'apple123')
        const employeur = await Employeur.findById(idEmployeur)
        expect(employeur.Id_entreprise).toEqual(1234)
        expect(employeur.Nom_entreprise).toEqual('Apple')
        expect(employeur.Nom_recruteur).toEqual('Mark Girson')
        expect(employeur.email).toEqual('markgirson@apple.com')
        expect(employeur.password).toEqual('apple123')
        done()
    })
})
