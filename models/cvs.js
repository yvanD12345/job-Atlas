

const mongoose = require('mongoose');
const schema = new mongoose.Schema({

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
<<<<<<< HEAD
	user_id: {
		type: String, required: true
	},
	title: {
		type: String, required: true
	},
=======
    user_id : {
        type: String, required: true 
    },
    title:{
        type: String, required:true
    },
>>>>>>> parent of 36d1946 (.)
})
const cvs = mongoose.model("cvs", schema);
module.exports = cvs