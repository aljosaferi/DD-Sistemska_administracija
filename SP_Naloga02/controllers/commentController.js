var CommentModel = require('../models/commentModel.js');

/**
 * commentController.js
 *
 * @description :: Server-side logic for managing comments.
 */
module.exports = {

    createCommentQuestion: function (req, res) {
        var comment = new CommentModel({
			body : req.body.body,
			created : Date.now(),
            postedBy : req.session.userId,
            questionReference : req.body.questionId,
            
        });

        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        var formattedDate = comment.created.toLocaleDateString("en-US", options);
        var formattedTime = comment.created.toLocaleTimeString("sl-SI", {hour: '2-digit', minute: '2-digit'});
        comment.createdDisplay = formattedDate + ' at ' + formattedTime;

        comment.save(function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating comment question',
                    error: err
                });
            }

            return res.redirect('/questions/' + req.body.questionId);
        });
    },
    createCommentAnswer: function (req, res) {
        var comment = new CommentModel({
			body : req.body.body,
			created : Date.now(),
            createdDisplay : '',
            postedBy : req.session.userId,
            answerReference : req.body.answerId
        });

        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        var formattedDate = comment.created.toLocaleDateString("en-US", options);
        var formattedTime = comment.created.toLocaleTimeString("sl-SI", {hour: '2-digit', minute: '2-digit'});
        comment.createdDisplay = formattedDate + ' at ' + formattedTime;

        comment.save(function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating comment answer',
                    error: err
                });
            }

            return res.redirect('/questions/' + req.body.questionId);
        });
    },
};
