var CommentModel = require('../models/commentModel.js');
var UserModel = require('../models/userModel.js');
var PhotoModel = require('../models/photoModel.js');

/**
 * commentController.js
 *
 * @description :: Server-side logic for managing comments.
 */
module.exports = {


    listByPhoto: function (req, res) {
        var id = req.params.id;
    
        CommentModel.find({photoReference: id})
        .populate('postedBy')
        .exec(function (err, comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }
    
            return res.json(comments);
        });
    },
    /**
     * commentController.list()
     */
    list: function (req, res) {
        CommentModel.find(function (err, comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }

            return res.json(comments);
        });
    },

    /**
     * commentController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({_id: id}, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }

            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }

            return res.json(comment);
        });
    },

    /**
     * commentController.create()
     */
    create: function (req, res) {

        console.log("testing");
        console.log(req.body.comment);
        console.log(req.body.dateCreated);
        console.log(req.body.userId);
        console.log(req.body.photoId);

        var comment = new CommentModel({
			body : req.body.comment,
			dateCreated : req.body.dateCreated,
            postedBy : req.body.userId,
            photoReference : req.body.photoId
        });

        comment.save(function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating comment',
                    error: err
                });
            }

            UserModel.updateOne({_id: req.body.userId}, {$inc: {numberOfComments: 1}}, function(err) {
                if (err) {
                    console.log('Error when updating user');
                }
            });

            PhotoModel.findOne({_id: req.body.photoId}, function(err, photo) {
                if (err || !photo) {
                    console.log('Error when finding photo or photo does not exist');
                } else {
                    photo.numberOfComments += 1;
                    photo.save(function(err) {
                        if (err) {
                            console.log('Error when saving photo');
                        }
                    });
                }
            });

            return res.status(201).json(comment);
        });
    },

    /**
     * commentController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({_id: id}, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment',
                    error: err
                });
            }

            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }

            comment.body = req.body.body ? req.body.body : comment.body;
			comment.dateCreated = req.body.dateCreated ? req.body.dateCreated : comment.dateCreated;
			
            comment.save(function (err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comment.',
                        error: err
                    });
                }

                return res.json(comment);
            });
        });
    },

    /**
     * commentController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CommentModel.findByIdAndRemove(id, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the comment.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
