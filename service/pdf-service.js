PDFDocument = require('pdfkit');
Cvs = require('../models/cvs');
const doc = require('pdfkit');
//js "util" module provides some functions to print formatted strings 
const util = require("util");
const fs = require("fs");
const ejs = require("ejs");
const pdf = require("html-pdf");

//const readFile = util.promisify(fs.readFile);

//promisify
//promet le nom du directory lorsqu'il est defini
const mkdir = util.promisify(fs.mkdir);

const writeFile = util.promisify(fs.writeFile);


    function createCv(thecv,res){
    
    
    if(thecv){
      
      //obtenir l'html de la page
      async function render() {
        try {
          //create output directory
          await mkdir("dist", { recursive: true });
          console.log("jai creer repertoire");
          //met le contenu de index.ejs en html string dans html
          const html = await ejs
            .renderFile("dist/index.ejs", { model: thecv })//envoie le contenu du cv choisi dans le ejs
            .then((output) => output);
          //creer le fichier index et met le contenu de html dedans
          await writeFile("dist/index.html", html, "utf8");
        } catch (error) {
          console.log(error);
        }
      }

      render();
      
      
      output = Date.now() + "dist/cv.pdf"
      //prend tt le contenu dans index.html apres l'avoir lu et le 
      //met dans html
      var html = fs.readFileSync("dist/index.html", "utf8");
      var options = { format: "Letter" };
      //creer un pdf en inserant le contenu de html et envoie le pdf creer dans output
      pdf .create(html, options)
      .toFile(output, function (err, response) {
        if (err) return console.log(err);
        //telecharge le cv si tout à marcher
          console.log(response.filename); // { filename: '/app/businesscard.pdf' }
          
          res.download(response.filename, () => {
              
          })
          
      });
    }
    }
    module.exports = {createCv};
