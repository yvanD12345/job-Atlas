


const mongoose = require('mongoose');
const schema = new mongoose.Schema ({
	
    first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
    user_id : {
        type: String, required: true 
    },
    title:{
        type: String, required:true
    },
	workPlace1:{
		type:String,
	},
	workRole1:{
		type:String,
	},
	workDuties1:{
		type:String,
	},
	workPlace2:{
		type:String,
		
	},
	workRole2:{
		type:String,
		
	},
	workDuties2:{
		type:String,
		
	},
	workPlace3:{
		type:String,
	
	},
	workRole3:{
		type:String,

	},
	workDuties3:{
		type:String,
	
	},
	certificateName1:{
		type:String,
	},
	optentiondate1:{
		type:String,
	},
	schoolName1:{
        type:String,
	},
	certificateName2:{
		type:String,
	},
	optentiondate2:{
		type:String,
	},
	schoolName2:{
        type:String,
	},
	certificateName3:{
		type:String,
	},
	optentiondate3:{
		type:String,
	},
	schoolName3:{
        type:String,
	},
	skill1:{
		type: String,
	},
    skill2:{
		type: String,
	},
	skill3:{
        type: String,
	},
	langue1:{
		type: String,
	},
	langue2:{
		type: String,
	},
	postalcode:{
        type: String,
	},
	city:{
		type:String,
	},
	country:{
        type:String,
	},
	streetnumber:{
		type:String,
	},
    streetname:{
        type:String,
	},
	cellphone:{
		type:String,
	}

	/*
	experience2:{
		type: String,
	},
	experience3:{
		type: String,
	},
	formation:{
        type:String,
	},
	competence1:{
		type:String,
		required:true
	},
	competence2:{
		type:String,
	},
	competence3:{
		type:String,
	},
	langue1:{
		type:String,
	},
	langue2:{
		type:String,
	}
*/

})
const cvs = mongoose.model("cvs", schema);
module.exports=cvs