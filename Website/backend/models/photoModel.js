const fs = require('fs');
const path = require('path');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'imagePath' : { type: String, required: true }
});

photoSchema.pre('findOneAndDelete', async function(next) {
	try {
		const photo = await this.model.findOne(this.getFilter());
		if (photo) {
			fs.unlink(path.join(__dirname, '..', 'public', photo.imagePath), err => {
				if (err) {
					console.error('Error when deleting the photo file:', err);
				}
			});
			console.log(5)
		}
		next()
	} catch(error) {
		next(error)
	}
})

module.exports = mongoose.model('photo', photoSchema);
