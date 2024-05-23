var CommentModel = require('../models/commentModel.js');
var ReplyModel = require('../models/replyModel.js');

/**
 * commentController.js
 *
 * @description :: Server-side logic for managing comments.
 */
module.exports = {

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
        if (!req.body.content) {
            return res.status(400).send({ error: 'Content is required' });
        } else if(!req.query.photoId) {
            return res.status(400).send({ error: 'PhotoId is required' });
        }
        var comment = new CommentModel({
			content : req.body.content,
			postedBy : req.session.userId,
            photo : req.query.photoId,
			likes : 0,
			likedBy : [],
            created: new Date()
        });

        comment.save(function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating comment',
                    error: err
                });
            }
            CommentModel.findById(comment._id)
            .populate('postedBy')
            .exec(function(err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when populating comment',
                    error: err
                });
            }

            return res.status(201).json(comment);
            });
        });
    },

    like: function (req, res) {
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

            if (comment.likedBy.includes(req.session.userId)) {
                comment.likes -= 1;
                comment.likedBy.pull(req.session.userId);
            } else {
                comment.likes += 1;
                comment.likedBy.push(req.session.userId);
            }

            comment.save(function (err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comment',
                        error: err
                    });
                }

                return res.status(200).json({
                    message: 'Comment liked/unliked successfully',
                });
            });
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

            comment.content = req.body.content ? req.body.content : comment.content;
			
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

        CommentModel.findById(id)
        .populate('replies')
        .exec(function (err, comment) {
            if(err) {
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

            ReplyModel.deleteMany({ comment: comment._id }, function(err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the replies.',
                        error: err
                    });
                }

                CommentModel.findByIdAndRemove(id, function (err, comment) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the comment.',
                            error: err
                        });
                    }

                    if (!comment) {
                        return res.status(404).json({
                            message: 'No such comment'
                        });
                    }
        
                    return res.status(204).json();
                });
            });
        });
    }
};
