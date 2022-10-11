// jest.setTimeout(7500)
const db = require('../connexion')
const Emploi = require('../models/Offre_emploi')
const rechercheMethodes = require('../fonctions/recherche');


beforeAll(async () => await db.connexion())
//afterEach(async () => await db.effacerBD())
 afterAll(async () => await db.deconnexionBD())

// Le describe sert à mettre les tests similaires ensemble dans un même endroit
//Ceci est un test régulier avec JEST
describe('Recherche emploi', () => {
    it('Doit trouver un emploi/stage dans la base de données', async () => {
        const mot = rechercheMethodes.escapeRegex(programmeur);
        const resultat = rechercheMethodes.rechercheMotCle(mot);
        console.log(testEmploi)
        console.log(resultat)
        expect((await mot)).toBe(resultat.Titre_emploi);
    })

})