var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

const MenuModel = require('./menuModel');

var restaurantSchema = new Schema({
	'name' : { type: String, required: true },
	'address' : { type: String, required: true },
	'owner' : {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	'photo' : {
		type: Schema.Types.ObjectId,
		ref: 'photo',
		required: true
	},
	'mealPrice' : { type: Number, required: true },
	'mealSurcharge' : { type: Number, required: true },
	'workingHours' : { 
		type: [{
			day: { type: String, required: true },
			open: { type: String, required: true },
			close: { type: String, required: true }
		}],
		required: true
	},
	'tags' : {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'tag',
			required: true 
		}],
		required: true,
		default : []
	},
	'location' : {
        type: {type: String, required: true, default: "Point"},
        coordinates: {type: [Number], required: true },
    },
	'ratings': {
		type: [{
        	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        	score: { 
				type: Number, 
				required: true,
				min: 1, max: 5,
				validate : {
					validator : Number.isInteger,
					message   : '{VALUE} is not an integer value'
				}  
			}
    	}],
		required: true,
		default : [] 
	},
},
{ 
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

restaurantSchema.index({ location: '2dsphere' });

restaurantSchema.virtual('menus', {
	ref: 'menu',
	localField: '_id',
	foreignField: 'restaurant'
})

restaurantSchema.virtual('averageRating').get(function() {
    if (this.ratings.length === 0) {
        return 0;
    }
    
    var avgScore = 0;
    for(let rating of this.ratings) {
        avgScore += rating.score;
    }
    avgScore /= this.ratings.length;
    avgScore = Math.round(avgScore * 10) / 10; // Round to one decimal place
    return avgScore;
});

restaurantSchema.pre('findOneAndDelete', async function(next) {
	try {
		const restaurant = await this.model.findOne(this.getFilter()).populate('menus');
		if (restaurant) {
			if (restaurant.photo.toString() !== process.env.DEFAULT_RESTAURANT_PHOTO_ID) {
				await PhotoModel.findOneAndDelete({ _id: restaurant.photo });
			}
			await MenuModel.deleteMany({ _id: { $in: restaurant.menus } });
		}
		next()
	} catch(error) {
		next(error)
	}
	
});

module.exports = mongoose.model('restaurant', restaurantSchema);
