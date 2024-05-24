var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
	'body' : String,
	'dateCreated' : Date,
	postedBy : {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	photoReference : {
		type: Schema.Types.ObjectId,
		ref: 'photo'
	},
});

module.exports = mongoose.model('comment', commentSchema);
