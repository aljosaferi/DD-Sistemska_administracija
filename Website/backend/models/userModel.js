var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt = require('bcrypt');

const PhotoModel = require('./photoModel');
const RestaurantModel = require('./restaurantModel');

var userSchema = new Schema(
	{
		'username' : { type: String, required: true },
		'firstName' : { type: String, required: true },
		'lastName' : { type: String, required: true },
		'email' : { type: String, required: true },
		'password' : { type: String, required: true },
		'profilePhoto' : {
			type: Schema.Types.ObjectId,
			ref: 'photo',
			required: true
		},
		'userType' : { 
			type: String, 
			enum: ['regular', 'admin', 'restaurantOwner'], 
			required: true 
		},
	},
	{ 
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

userSchema.virtual('restaurants', {
	ref: 'restaurant',
	localField: '_id',
	foreignField: 'owner'
})

userSchema.pre('save', function(next) {
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		if(err){
			return next(err);
		}
		user.password = hash;
		next();
	});
});

userSchema.pre('findOneAndDelete', async function(next) {
	try {
		const user = await this.model.findOne(this.getFilter()).populate('restaurants');

		if(user) {
			if (user.profilePhoto.toString() !== process.env.DEFAULT_AVATAR_ID) {
				await PhotoModel.findOneAndDelete({ _id: user.profilePhoto });
			}
			await RestaurantModel.updateMany(
				{}, 
				{ $pull: { ratings: { user: user._id } } }
			);
			if(user.userType === "restaurantOwner") {
				for (let restaurantId of user.restaurants) {
					await RestaurantModel.findOneAndDelete({_id: restaurantId})
				}
			}
		}
		next()
	} catch(error) {
		next(error)
	}
});

userSchema.statics.authenticate = function(username, password, callback){
	User.findOne({username: username})
	.then(user => {
		if(!user) {
			var err = new Error("User not found.");
			err.status = 401;
			return callback(err);
		} 
		bcrypt.compare(password, user.password, function(err, result){
			if(result === true){
				return callback(null, user);
			} else{
				return callback();
			}
		});
	})
	.catch(err => {
		return callback(err);
	});
}

var User = mongoose.model('user', userSchema);
module.exports = User;
