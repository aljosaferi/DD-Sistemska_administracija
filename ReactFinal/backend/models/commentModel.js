var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
	'content' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'photo' : {
		type: Schema.Types.ObjectId,
		ref: 'photo'
	},
	'likes' : Number,
	'likedBy' : [{
		type: Schema.Types.ObjectId,
		ref: 'user'
   }],
   'created' : Date
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

commentSchema.virtual('replies', {
	ref: 'reply',
	localField: '_id',
	foreignField: 'comment'
});

module.exports = mongoose.model('comment', commentSchema);
