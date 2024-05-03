var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
	'body' : String,
	'created' : Date,
	'createdDisplay' : String,

	postedBy : {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	questionReference : {
		type: Schema.Types.ObjectId,
		ref: 'question'
	},
	answerReference : {
		type: Schema.Types.ObjectId,
		ref: 'answer'
	}
});

module.exports = mongoose.model('comment', commentSchema);
