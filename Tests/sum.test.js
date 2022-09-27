// On fait appel au fichier contenant les fonctions que l'on veut tester
const additionDeuxNbr = require('./sum')

// A partir de la, la fonction presente dans le fichier sum sera disponible
test('la somme se fait bien', () => {
   expect(additionDeuxNbr(1,2)).toBe(3)
})