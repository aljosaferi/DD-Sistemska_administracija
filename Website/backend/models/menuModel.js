var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var menuSchema = new Schema({
	'dish' : { type: String, required: true },
	'sideDishes' : {
		type: [{ 
			type: String,
			required: true
		}],
		required: true
	},
	'restaurant' : {
		type: Schema.Types.ObjectId,
		ref: 'restaurant',
		required: true
	},
	'tag' : {
		type: Schema.Types.ObjectId,
		ref: 'tag',
	   	required: true
   },
},
{ 
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

module.exports = mongoose.model('menu', menuSchema);
