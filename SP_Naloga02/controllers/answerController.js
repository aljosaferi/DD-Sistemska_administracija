var AnswerModel = require('../models/answerModel.js');
var QuestionModel = require('../models/questionModel.js');
var CommentModel = require('../models/commentModel.js');

/**
 * answerController.js
 *
 * @description :: Server-side logic for managing answers.
 */
module.exports = {

    markBest: function (req, res) {
        var answerId = req.body.answerId;
        var questionId = req.body.questionId;
        console.log(questionId);
        var userId = req.session.userId;
        
        AnswerModel.findById(answerId)
            .populate('questionReference')
            .exec(function (err, answer)
        {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }

            answer.isBest = true;

            answer.save((err) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer',
                        error: err
                    });
                }
            
                //update question model da ma nastavlen best answer
                QuestionModel.findById(questionId, function (err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting question',
                            error: err
                        });
                    }
    
                    if (!question) {
                        return res.status(404).json({
                            message: 'No such question'
                        });
                    }
    
                    question.hasBestAnswer = true;
    
                    question.save((err) => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating question',
                                error: err
                            });
                        }
    
                        //return res.render('questions/' + question._id, {question: question, answer: answer})
                        return res.redirect('/questions/' + question._id);
                    });
                });
            });
        });
    },

    unmarkBest: function (req, res) {
        var answerId = req.body.answerId;
        var questionId = req.body.questionId;
        console.log(questionId);
        var userId = req.session.userId;
        
        AnswerModel.findById(answerId)
            .populate('questionReference')
            .exec(function (err, answer)
        {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }

            answer.isBest = false;

            answer.save((err) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer',
                        error: err
                    });
                }
            
                //update question model da ma nastavlen best answer
                QuestionModel.findById(questionId, function (err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting question',
                            error: err
                        });
                    }
    
                    if (!question) {
                        return res.status(404).json({
                            message: 'No such question'
                        });
                    }
    
                    question.hasBestAnswer = false;
    
                    question.save((err) => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating question',
                                error: err
                            });
                        }
    
                        //return res.render('questions/' + question._id, {question: question, answer: answer})
                        return res.redirect('/questions/' + question._id);
                    });
                });
            });
        });
    },

    updateLikes: function (req, res) {
        var answerId = req.body.answerId;
        var action = req.body.action;
        var userId = req.session.userId;

        AnswerModel.findById(answerId, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }
            if (action === 'like') {
                if (!answer.likedBy.includes(userId)) {
                    if (answer.dislikedBy.includes(userId)) {
                        answer.dislikedBy.remove(userId);
                        answer.likedBy.push(userId);
                        answer.isLiked = true;
                        answer.isDisliked = false;
                        answer.score += 2;
                    }
                    else {
                    answer.likedBy.push(userId);
                    answer.isLiked = true;
                    answer.isDisliked = false;
                    answer.score++;
                    }
                }
                else {
                    answer.likedBy.remove(userId);
                    answer.isLiked = false;
                    answer.score--;
                }
            } else if (action === 'dislike') {
                if (!answer.dislikedBy.includes(userId)) {
                    if (answer.likedBy.includes(userId)) {
                        answer.likedBy.remove(userId);
                        answer.dislikedBy.push(userId);
                        answer.isDisliked = true;
                        answer.isLiked = false;
                        answer.score -= 2;
                    }
                    else {
                    answer.dislikedBy.push(userId);
                    answer.score--;
                    answer.isDisliked = true;
                    answer.isLiked = false;
                    }
                }
                else {
                    answer.dislikedBy.remove(userId);
                    answer.isDisliked = false;
                    answer.score++;
                }
            }
            answer.save((err) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer',
                        error: err
                    });
                }
            
                return res.redirect(req.body.currentUrl);
            });
        });
    },

    /**
     * answerController.list()
     */
    list: function (req, res) {
        var questionId = req.params.questionId; //to prije iz url-a

        AnswerModel.find({questionReferenc: questionId}, function (err, answers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }

            return res.render('question/displayQuestion', {answers: answers})
        });
    },

    /**
     * answerController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        AnswerModel.findOne({_id: id}, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }

            return res.json(answer);
        });
    },

    /**
     * answerController.create()
     */
    create: function (req, res) {
        console.log(req.body);
        var questionId = req.body.questionId;

        var answer = new AnswerModel({
			body : req.body.body,
			score : 0,
			postedBy : req.session.userId,
			questionReference : req.body.questionId,
			created : Date.now(),
            createdDisplay : '',
            isLiked: false,
            isDisliked: false,
            isBest: false,
            isOwner : false,
        });

        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        var formattedDate = answer.created.toLocaleDateString("en-US", options);
        var formattedTime = answer.created.toLocaleTimeString("sl-SI", {hour: '2-digit', minute: '2-digit'});
        answer.createdDisplay = formattedDate + ' at ' + formattedTime;

        answer.save(function(err, savedAnswer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating answer',
                    error: err
                });
            }
    
            QuestionModel.findById(questionId, function (err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting question',
                        error: err
                    });
                }
                if (!question) {
                    return res.status(404).json({
                        message: 'No such question'
                    });
                }
    
                question.numberOfAnswers = question.numberOfAnswers + 1;
    
                question.save(function(err) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating question',
                            error: err
                        });
                    }
    
                    return res.redirect('/questions/' + req.body.questionId);
                });
            });
        });
    },

    /**
     * answerController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        AnswerModel.findOne({_id: id}, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }

            answer.body = req.body.body ? req.body.body : answer.body;
			answer.score = req.body.score ? req.body.score : answer.score;
			answer.postedBy = req.body.postedBy ? req.body.postedBy : answer.postedBy;
			answer.questionReference = req.body.questionReference ? req.body.questionReference : answer.questionReference;
			answer.created = req.body.created ? req.body.created : answer.created;
			
            answer.save(function (err, answer) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer.',
                        error: err
                    });
                }

                return res.json(answer);
            });
        });
    },

    deleteAnswer: function(req, res) {
        var answerId = req.body.answerId;
        var questionId = req.body.questionId;
        var action = req.body.action;

        console.log(answerId + " " + action);
        AnswerModel.findById(answerId, function (err, answer) {
            if (answer.isBest) {
                QuestionModel.findById(questionId, function (err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting question',
                            error: err
                        });
                    }
    
                    if (!question) {
                        return res.status(404).json({
                            message: 'No such question'
                        });
                    }
    
                    question.hasBestAnswer = false;
    
                    question.save((err) => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating question',
                                error: err
                            });
                        }
                    });
                });
            }

            if (action === 'remove') {

                AnswerModel.findByIdAndRemove(answerId, function (err, answer) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the answer.',
                            error: err
                        });
                    }

                    CommentModel.deleteMany({answerReference: answerId}, function (err, comments) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when deleting the comments.',
                                error: err
                            });
                        }

                    return res.redirect(req.body.currentUrl);
                    });
                });
            }
        });
    }
};
