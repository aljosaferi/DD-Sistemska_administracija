var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var questionSchema = new Schema({
	'title' : String,
	'body' : String,
	'postedBy' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
   },
	'created' : Date,
	'createdDisplay' : String,
	'hasBestAnswer' : Boolean,
	'isOwner' : Boolean,

	'numberOfAnswers' : Number,

	'hotScore' : {
		'score' : Number,
		'timesArray' : {type: [Date], default: []}
	}
});

questionSchema.virtual('commentsQuestion', {
	ref: 'comment', //to se relata na comment model
	localField: '_id', //to se relajta na _id od questiona
	foreignField: 'questionReference' //to se relata na questionReference v comment modelu, ki kaze na _id od questiona
});

questionSchema.statics.calculateHotness = function(questions) {
	const ONE_MINUTE = 60 * 60000; //2 minuta in ms
	var validQuestions = [];
	
	validQuestions.length = 0;

	questions.forEach(question => {
		let isModified = false;
		let pushed = false;

		for (let i = question.hotScore.timesArray.length - 1; i >= 0; i--) {
			const time = question.hotScore.timesArray[i];
			const currentTime = Date.now();
			const timeDifference = currentTime - new Date(time);

			if (timeDifference > ONE_MINUTE) {
				question.hotScore.score--;
				question.hotScore.timesArray.splice(i, 1);
				isModified = true;
			}
			else if (question.hotScore.score > 0 && pushed === false) {
				//console.log('Question is hot');
				validQuestions.push(question);
				pushed = true;
				isModified = true;
			}
		}
		if (isModified) {
			question.save(err => {
				if (err) {
					console.log('Error when updating question');
				} 
			});
		}
	});

	

	validQuestions.sort(function(a, b) {
		return b.hotScore.score - a.hotScore.score ;
	});

	console.log('Valid questions: ', validQuestions.length);
	console.log("VAlid questions" + validQuestions + "\n--------------------------------------------");

	var topQuestions = validQuestions.slice(0, 5);

	topQuestions = topQuestions.filter((question, index, self) =>
		index === self.findIndex((t) => (
			t._id === question._id
		))
	);

	//console.log(topQuestions);

	return topQuestions;
},



module.exports = mongoose.model('question', questionSchema);
