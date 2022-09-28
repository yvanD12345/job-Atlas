const mongoose = require('mongoose');
//connect to mongodb
function connexion(){
    mongoose.connect('mongodb://localhost:27017/JobAtlas_database');
    mongoose.connection.once('open',()=>{
        console.log('connection has been made');
    }).on('error',(error)=>console.log(error));
}
// //Déconnecte et ferme la connexion
async function deconnexionBD(){
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
 }

// //Efface toutes les données
async function effacerBD(){
   const collections=mongoose.connection.collection;
   for (const key in collections){
    const collection=collections[key];
    await collection.deleteMany();
   }
 }
module.exports={
    connexion:connexion,
    effacerBD:effacerBD,
    deconnexionBD:deconnexionBD
}

//cloud
//'mongodb+srv://JobAtlas:JobAtlas@cluster0.6a5olob.mongodb.net/?retryWrites=true&w=majority'
//local
//'mongodb://localhost:27017/JobAtlas_database'