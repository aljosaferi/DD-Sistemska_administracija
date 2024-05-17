var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'name' : String,
	'description' : String,
	'path' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'views' : Number,
	'likes' : Number,
	'likedBy' : [{
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	}],
	'flaggedBy' : [{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'user' 
	}],
	'created' : Date
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

photoSchema.virtual('comments', {
	ref: 'comment',
	localField: '_id',
	foreignField: 'photo'
});

module.exports = mongoose.model('photo', photoSchema);
