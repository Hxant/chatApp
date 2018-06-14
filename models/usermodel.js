

const mongoose = require('mongoose');

var userschema = mongoose.Schema({
	fname : String,
	lname : String,
	email : String,
	password : String,
	friends : [String],
});
 ///methods on the schema 'userschema.methods.method_name'

 //

 var User = mongoose.model('User',userschema);

 module.exports = User;
