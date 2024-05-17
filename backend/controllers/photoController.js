var PhotoModel = require('../models/photoModel.js');
var CommentModel = require('../models/commentModel.js');
var ReplyModel = require('../models/replyModel.js');

const decay = require('decay');
const hotScore = decay.hackerHot();

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
        PhotoModel.find({$and: [
            {'flaggedBy.4': { $exists: false }},
            {'flaggedBy': { $nin: [req.session.userId]}}
        ]})
        .sort({ created: -1 })
        .populate('postedBy')
        .exec(async function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            let photosWithCommentCount = await Promise.all(photos.map(async photo => ({ 
                ...photo._doc, 
                commentCount: await CommentModel.countDocuments({ photo: photo._id }) 
            })));

            if(req.query.sortBy) {
                if(req.query.sortBy === 'newest-first') {
                    //Already handled with DB query
                } else if(req.query.sortBy === 'hotness') {
                    photosWithCommentCount = photos.map(photo => ({ 
                        ...photo._doc, hotness: hotScore(photo.likes, new Date(photo.created))
                    }));
                    photosWithCommentCount.sort((a, b) => b.hotness - a.hotness);
                }
            }

            return res.json(photosWithCommentCount);
        });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id})
        .populate('postedBy')
        .populate({
            path: 'comments',
            populate: { 
                path: 'postedBy'
            }
        })
        .exec(function (err, photo) {
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
            description: req.body.description,
			path : "/images/"+req.file.filename,
			postedBy : req.session.userId,
			views : 0,
			likes : 0,
            likedBy : [],
            created: new Date()
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    like: function (req, res) {
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

            if (photo.likedBy.includes(req.session.userId)) {
                photo.likes -= 1;
                photo.likedBy.pull(req.session.userId);
            } else {
                photo.likes += 1;
                photo.likedBy.push(req.session.userId);
            }

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo',
                        error: err
                    });
                }

                return res.status(200).json({
                    message: 'Photo liked/unliked successfully',
                });
            });
        });
    },

    flag: function (req, res) {
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

            if (photo.flaggedBy.includes(req.session.userId)) {
                photo.flaggedBy.pull(req.session.userId);
            } else {
                photo.flaggedBy.push(req.session.userId);
            }

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo',
                        error: err
                    });
                }

                return res.status(200).json({
                    message: 'Photo flagged/unflagged successfully',
                });
            });
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
            photo.description = req.body.description ? req.body.description : photo.description;
			photo.path = req.body.path ? req.body.path : photo.path;
			
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

        PhotoModel.findById(id)
        .populate({
            path: 'comments',
            populate: [{ path: 'replies' }]
        })
        .populate('comments')
        .populate('comments.replies')
        .exec(function (err, photo) {
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

            ReplyModel.deleteMany({ comment: { $in: photo.comments.map(comment => comment._id) } }, function(err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the replies.',
                        error: err
                    });
                }

                CommentModel.deleteMany({ photo: photo._id }, function(err) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the comments.',
                            error: err
                        });
                    }

                    PhotoModel.findByIdAndRemove(id, function (err, photo) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when deleting the photo.',
                                error: err
                            });
                        }
        
                        if (!photo) {
                            return res.status(404).json({
                                message: 'No such photo'
                            });
                        }
            
                        return res.status(204).json();
                    });
                });
            });
        });    
    },

    publish: function(req, res){
        return res.render('photo/publish');
    }
};
