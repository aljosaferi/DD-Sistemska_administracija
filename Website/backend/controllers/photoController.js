var PhotoModel = require('../models/photoModel.js');
var UserModel = require('../models/userModel.js');
var RestaurantModel = require('../models/restaurantModel.js');

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
        .then(photos => {
            return res.json(photos);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting photo.',
                error: err
            });
        });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id})
        .then(photo => {
            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            return res.json(photo);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting photo.',
                error: err
            });
        });
    },

    /**
     * photoController.create()
     */
    createProfilePhoto: async function (req, res) {
        try {
            var newPhoto = new PhotoModel({
                imagePath : "/images/" + req.file.filename
            });

            newPhoto = await newPhoto.save();

            const user = await UserModel.findOne({_id: req.user._id});

            if(user.profilePhoto.toString() !== process.env.DEFAULT_AVATAR_ID) {
                const oldPhoto = await PhotoModel.findOneAndDelete({_id: user.profilePhoto._id});
            }
            user.profilePhoto = newPhoto._id;
            await user.save();
            res.status(200).json(newPhoto);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating photo',
                error: err
            });
        }
    },

    createRestaurantPhoto: async function (req, res) {
        try {
            var newPhoto = new PhotoModel({
                imagePath : "/images/" + req.file.filename
            });

            newPhoto = await newPhoto.save();

            const restaurant = await RestaurantModel.findOne({_id: req.params.restaurantId});

            if(restaurant.photo.toString() !== process.env.DEFAULT_RESTAURANT_PHOTO_ID) {
                const oldPhoto = await PhotoModel.findOneAndDelete({_id: restaurant.photo});
            }
            restaurant.photo = newPhoto._id;
            await restaurant.save();
            res.status(200).json(newPhoto);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating photo',
                error: err
            });
        }
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id})
        .then(photo => {
            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.imagePath = req.body.imagePath ? req.body.imagePath : photo.imagePath;
			
            photo.save()
            .then(photo => {
                return res.json(photo);
            })
            .catch(err => {
                return res.status(500).json({
                    message: 'Error when updating photo.',
                    error: err
                });
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting photo',
                error: err
            });
        });
    },

    /**
     * photoController.remove()
     */
    removeProfilePhoto: function (req, res) {
        var id = req.params.id;

        if(id !== process.env.DEFAULT_AVATAR_ID && id !== process.env.DEFAULT_RESTAURANT_PHOTO_ID) {
            PhotoModel.findOneAndDelete({ _id: id })
            .then(photo => {
                if (!photo) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }
                UserModel.findOneAndUpdate({ profilePhoto: id }, { profilePhoto: process.env.DEFAULT_AVATAR_ID }, { new: true })
                .then(() => {
                    return res.status(204).json();
                })
                .catch(err => {
                    return res.status(500).json({
                        message: "Error when updating user's profile photo after deletion",
                        error: err
                    });
                });
            })
            .catch(err => {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            })
        }
    },

    removeRestaurantPhoto: function (req, res) {
        var id = req.params.id;

        if(id !== process.env.DEFAULT_AVATAR_ID && id !== process.env.DEFAULT_RESTAURANT_PHOTO_ID) {
            PhotoModel.findOneAndDelete({ _id: id })
            .then(photo => {
                if (!photo) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }

                RestaurantModel.findOneAndUpdate({ photo: id }, { photo: process.env.DEFAULT_RESTAURANT_PHOTO_ID }, { new: true })
                .then(() => {
                    return res.status(204).json();
                })
                .catch(err => {
                    return res.status(500).json({
                        message: "Error when updating restaurants's photo after deletion",
                        error: err
                    });
                });
            })
            .catch(err => {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            })
        }
    }
};
