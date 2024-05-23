var ReplyModel = require('../models/replyModel.js');

/**
 * replyController.js
 *
 * @description :: Server-side logic for managing replys.
 */
module.exports = {

    /**
     * replyController.list()
     */
    list: function (req, res) {
        ReplyModel.find(function (err, replys) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting reply.',
                    error: err
                });
            }

            return res.json(replys);
        });
    },

    /**
     * replyController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ReplyModel.findOne({_id: id}, function (err, reply) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting reply.',
                    error: err
                });
            }

            if (!reply) {
                return res.status(404).json({
                    message: 'No such reply'
                });
            }

            return res.json(reply);
        });
    },

    /**
     * replyController.create()
     */
    create: function (req, res) {
        var reply = new ReplyModel({
			content : req.body.content,
			postedBy : req.session.userId,
            comment : req.query.commentId,
			likes : 0,
			likedBy : [],
            created: new Date()
        });

        reply.save(function (err, reply) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating reply',
                    error: err
                });
            }

            return res.status(201).json(reply);
        });
    },

    /**
     * replyController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ReplyModel.findOne({_id: id}, function (err, reply) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting reply',
                    error: err
                });
            }

            if (!reply) {
                return res.status(404).json({
                    message: 'No such reply'
                });
            }

            reply.content = req.body.content ? req.body.content : reply.content;
			
            reply.save(function (err, reply) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating reply.',
                        error: err
                    });
                }

                return res.json(reply);
            });
        });
    },

    /**
     * replyController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ReplyModel.findByIdAndRemove(id, function (err, reply) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the reply.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
