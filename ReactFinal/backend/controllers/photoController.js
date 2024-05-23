var PhotoModel = require('../models/photoModel.js');
var UserModel = require('../models/userModel.js');

var decay = require('decay'), hotScore = decay.redditHot();

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {
    uploadProfilePhoto: function(req, res){
        var photo = new PhotoModel({
			name : req.session.userId + "PFP",
			path : "/images/"+req.file.filename,
			postedBy : req.session.userId,
            created : new Date(),
            decayingScore : 0,
            decayCycles : 0,
			views : 0,
			likes : 0,
            description : "PFP",
            numberOfReports : 0,
            numberOfComments : 0,
            isReported : false,
            likedBy : [],
            dislikedBy : [],
            reportedBy : [],
            isProfilePicture : true
        });

        console.log(req.file.filename)

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            UserModel.updateOne({_id: req.session.userId}, {$set: { profilePicturePath: "/images/"+req.file.filename }}, function(err) {
                if (err) {
                    console.log('Error when updating user');
                }
            });
    
            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    topPhotos: function(req, res){
        PhotoModel.find({ isReported: false, isProfilePicture: false })
        .populate('postedBy')
        .exec(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            const now = new Date();
            
            photos.forEach(photo => {
                let score;
                
                const hoursSincePosted = (now - photo.created) / 1000 / 60 / 60;
                let likes = photo.likedBy.length;
                let dislikes = photo.dislikedBy.length;

                if (hoursSincePosted < 1) {
                    likes *= 10;
                    dislikes *= 5;
                }
                else if (hoursSincePosted >= 1 && hoursSincePosted < 24) { 
                    likes *= 5;
                    dislikes *= 2;
                }
                score = likes - dislikes;

                if (hoursSincePosted > 12) {
                    const decayFactor = Math.floor(hoursSincePosted / 12);
                    score *= Math.pow(0.75, decayFactor);
                }
                photo.decayingScore = score;
            });

            photos.sort((a, b) => b.decayingScore - a.decayingScore);
            var data = [];
            data.photos = photos;
            //return res.render('photo/list', data);
            return res.json(photos);
        });
    },

    report: function(req, res){
        var photoId = req.body.photoId;
        var userId = req.body.userId;

        console.log("REPORTING__________________________________________________________________");

        PhotoModel.findById(photoId, function(err, photo){
            if(err){
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if(!photo){
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            console.log(photo.numberOfReports);

            if (!photo.reportedBy.includes(req.session.userId)) {
                photo.numberOfReports++;
                console.log(photo.numberOfReports);
                photo.reportedBy.push(userId);
            }
            if (photo.numberOfReports > 10) {
                photo.isReported = true;
                console.log("REMOVING FROM VIEW");
            }

            photo.save(function(err){
                if(err){
                    return res.status(500).json({
                        message: 'Error when updating photo',
                        error: err
                    });
                }

                return res.json(photo);
            });
            
        });
    },

    likeDislike: function(req, res){
        var likeDislikeValue = req.body.likeDislikeValue;
        var photoId = req.body.photoId;
        var userId = req.body.userId;

        console.log("value " + likeDislikeValue);
        console.log(photoId);
        console.log(userId);
        

        PhotoModel.findById(photoId, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }
            if (likeDislikeValue === 'like') {

                console.log("Liking message");

                if (!photo.likedBy.includes(userId)) {
                    if (photo.dislikedBy.includes(userId)) {
                        photo.dislikedBy.remove(userId);
                        photo.likedBy.push(userId);
                        photo.likes += 2;
                    }
                    else {
                    photo.likedBy.push(userId);
                    photo.likes++;
                    }
                }
                else {
                    photo.likedBy.remove(userId);
                    photo.isLiked = false;
                    photo.likes--;
                }
            } else if (likeDislikeValue === 'dislike') {
                console.log("disliking");
                if (!photo.dislikedBy.includes(userId)) {
                    if (photo.likedBy.includes(userId)) {
                        console.log("disliking and removing like");
                        photo.likedBy.remove(userId);
                        photo.dislikedBy.push(userId);
                        photo.likes -= 2;
                    }
                    else {
                    photo.dislikedBy.push(userId);
                    photo.likes--;
                    }
                }
                else {
                    photo.dislikedBy.remove(userId);
                    photo.likes++;
                }
            }
            else {
                console.log("Empty value");
            }
            
            photo.save((err) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo',
                        error: err
                    });
                }
            
                return res.json(photo);
            });
        });
    },
    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find({ isReported: false, isProfilePicture: false})
        .populate('postedBy')
        .exec(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            var data = [];
            data.photos = photos;
            //return res.render('photo/list', data);
            return res.json(photos);
        });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            return res.json(photo);
        });
    },

    /**
     * photoController.create()
     */
    create: function (req, res) {
        var photo = new PhotoModel({
			name : req.body.name,
			path : "/images/"+req.file.filename,
			postedBy : req.session.userId,
            created : new Date(),
            decayingScore : 0,
            decayCycles : 0,
			views : 0,
			likes : 0,
            description : req.body.description,
            numberOfReports : 0,
            numberOfComments : 0,
            isReported : false,
            likedBy : [],
            dislikedBy : [],
            reportedBy : [],
            isProfilePicture : false
        });

        console.log("NAME: " + req.body.name);
        console.log("DESCRIPTION: " + req.file.description);

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            UserModel.updateOne({_id: req.session.userId}, {$inc: {numberOfPosts: 1}}, function(err) {
                if (err) {
                    console.log('Error when updating user');
                }
            });
    
            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
			photo.path = req.body.path ? req.body.path : photo.path;
			photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
			photo.views = req.body.views ? req.body.views : photo.views;
			photo.likes = req.body.likes ? req.body.likes : photo.likes;
			
            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    publish: function(req, res){
        return res.render('photo/publish');
    }
};
