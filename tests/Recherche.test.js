const db = require('../connexion')
const Recherche = require('../fonctions/recherche')


beforeAll(async () => await db.connexion())
 afterEach(async () => await db.effacerBD())
 afterAll(async () => await db.deconnexionBD())


