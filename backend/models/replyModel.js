var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var replySchema = new Schema({
	'content' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'comment' : {
		type: Schema.Types.ObjectId,
		ref: 'comment'
	},
	'likes' : Number,
	'likedBy' : [{
		type: Schema.Types.ObjectId,
		ref: 'user'
   }],
   'created' : Date
});

module.exports = mongoose.model('reply', replySchema);
