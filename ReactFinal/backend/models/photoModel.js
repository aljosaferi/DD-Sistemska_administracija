var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'name' : String,
	'path' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'decayingScore' : Number,
	'created' : Date,
	'likes' : Number,
	'description' : String,
	'numberOfComments' : Number,
	'decayCycles' : Number,

	'likedBy' : [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	'dislikedBy' : [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	'numberOfReports' : Number,
	'isReported' : Boolean,
	'reportedBy' : [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	'isProfilePicture' : Boolean
});

module.exports = mongoose.model('photo', photoSchema);
