PDFDocument = require('pdfkit');
Cvs = require('../models/cvs');
let blodStream = require('blob-stream')
let iframe = require('node-iframe')
fs = require('fs');

    function createCv(thecv,res){
    
    
    if(thecv){
        // Create a document
        doc = new PDFDocument();
        doc.pipe( fs.createWriteStream('out.pdf') );
        // rest of the code goes here...
        // Adding functionality
    doc
       
    .fontSize(27)
    .text('name : '+thecv.first_name+'/n', 100, 100);
  
  
    
  // Adding an image in the pdf.
    
    /*doc.image('download3.jpg', {
      fit: [300, 300],
      align: 'center',
      valign: 'center'
    });
    */
    doc
    .addPage()
    .fontSize(27)
    .text('email:'+thecv.email, 100, 100);
     
    
     
  // Apply some transforms and render an SVG path with the 
  // 'even-odd' fill rule
  doc
    .scale(0.6)
    .translate(470, -380)
    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    .fill('red', 'even-odd')
    .restore();
     
  // Add some text with annotations
  doc
    .addPage()
    .fillColor('blue')
    .text('The link for GeeksforGeeks website', 100, 100)
      
    .link(100, 100, 160, 27, 'https://www.geeksforgeeks.org/');
     
  // Finalize PDF file
  
  createdPdf = doc;
        doc.end();
        
        doc.pipe( res )
   
    }
    }
    module.exports = {createCv};