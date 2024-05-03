var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var answerSchema = new Schema({
	'body' : String,
	'score' : Number,
	'postedBy' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
   	},
   	'questionReference' : {
		type: Schema.Types.ObjectId,
		ref: 'question'
	},
	'created' : Date,
	'createdDisplay' : String,

	likedBy: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	dislikedBy: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	'isLiked' : Boolean,
	'isDisliked' : Boolean,
	'isBest' : Boolean,
	'isOwner' : Boolean,
});

answerSchema.virtual('commentsAnswer', {
	ref: 'comment', //to se relata na comment model
	localField: '_id', //to se relajta na _id od answera
	foreignField: 'answerReference' //to se relata na answerReference v comment modelu, ki kaze na _id od answera
});

answerSchema.statics.answersList = function(question) {
    return new Promise((resolve, reject) => {
        this.find({ questionReference: question._id }, function(err, answers) {
            if (err) {
                reject(err);
            } else {
                resolve(answers);
            }
        });
    });
}

module.exports = mongoose.model('answer', answerSchema);
