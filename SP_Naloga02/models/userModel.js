var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'password' : String,
	'email' : String,
	'hasProfilePicture' : Boolean,
	'profilePicturePath' : String,

	'numberOfQuestions' : Number,
	'numberOfAnswers' : Number,
});

userSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		if(err){
			return next(err);
		}
		user.password = hash;
		next();
	});
});

userSchema.statics.authenticate = function(username, password, callback){
	User.findOne({username: username})
	.exec(function(err, user){
		if(err){
			console.log('Error finding user:', err);
			return callback(err);
		} else if(!user) {
			console.log('User not found:', username);
			var err = new Error("User not found.");
			err.status = 401;
			return callback(err);
		} 
		console.log('User found:', user);
		bcrypt.compare(password, user.password, function(err, result){
			console.log(result);
			if(result === true){
				return callback(null, user);
			} else{
				console.log(password);
				return callback();
			}
		});
		 
	});
}

var User = mongoose.model('user', userSchema);
module.exports = User;
