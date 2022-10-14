// jest.setTimeout(7500)
const db = require('../connexion')
const Emploi = require('../models/Offre_emploi')
const rechercheMethodes = require('../fonctions/recherche');


beforeAll(async () => await db.connexion())
//afterEach(async () => await db.effacerBD())
//  afterAll(async () => await db.deconnexionBD())

// Le describe sert à mettre les tests similaires ensemble dans un même endroit
//Ceci est un test régulier avec JEST
describe('Recherche emploi', () => {
    it('Doit trouver un emploi/stage dans la base de données', async () => {
        const mot = rechercheMethodes.escapeRegex('stage');
        const resultats = await rechercheMethodes.rechercheMotCle(mot);
        console.log(mot)
        console.log(resultats)
        for( i=0;i>resultats.length;i++){
            expect((mot)).toBe(resultat[i].Titre_emploi);
        }
        
    })

})