const { mongo, default: mongoose } = require('mongoose');
var QuestionModel = require('../models/questionModel.js');
var AnswerModel = require('../models/answerModel.js');
var CommentModel = require('../models/commentModel.js');

/**
 * questionController.js
 *
 * @description :: Server-side logic for managing questions.
 */
module.exports = {

    
    /* Funkcija iz podatkovne baze izbriše vprašanje, in nanj vezane odgovore */
    removeQuestion: function(req, res) {
        var id = req.body.questionId;
        if (req.body.action == 'remove') {
            AnswerModel.deleteMany({questionReference: id}, function (err, answers) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the answers.',
                        error: err
                    });
                }                

                QuestionModel.findByIdAndRemove(id, function (err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the question.',
                            error: err
                        });
                    }

                    CommentModel.deleteMany({questionReference: id}, function (err, comments) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when deleting the comments.',
                                error: err
                            });
                        }
                        
                        return res.redirect(req.body.currentUrl);
                    });
                });
            });
        }
        else {
            console.log('error');
        }
    },

    showNewQuestionForm: function (req, res) {
        res.render('question/newQuestionForm');
    },

    listMyQuestions: function (req, res) {
        QuestionModel.find({postedBy: req.session.userId})
        .populate('postedBy') //avtomatsko zamenja id s celotnim uporabnikom
        .exec(function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            var data = [];
            data.questions = questions;
            return res.render('question/myQuestions', data);
        });
    },

    /**
     * questionController.list()
     */
    list: function (req, res) {
        QuestionModel.find()
        .populate('postedBy')
        .exec(function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            var data = [];
            data.questions = questions;
            return res.render('index', data);
        });
    },

    /**
     * questionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        QuestionModel.findOne({_id: id}) 
        .populate('postedBy')
        .populate({
            path: 'commentsQuestion',
            populate: { path: 'postedBy' }
        })
        .exec(function (err, question)
        {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }

            var AnswerModel = mongoose.model('answer');
            AnswerModel.find({questionReference: id})
            .populate('postedBy')
            .populate({
                path: 'commentsAnswer',
                populate: { path: 'postedBy' }
            })
            .exec(function (err, answers) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting answer.',
                        error: err
                    });
                }
                //vmesna pomoc da preverim ali naj izpisem favourite button ali ne, to se preveri vsakic ko sen alozi, dela za vsakega usera posebej
                if (question.postedBy._id == req.session.userId) {
                    question.isOwner = true;
                }
                else {
                    question.isOwner = false;
                }

                //nastavi hot score
                question.hotScore.score++;
                question.hotScore.timesArray.push(Date.now());

                question.save((err) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating question',
                            error: err
                        });
                    }    
                        

                    /*toti del spodaj je tak zato ker mam array answers, pa ga nea morem samo z save updatat 
                    ker jih vec naenkrat posodobi, zato je tota shitty promise.all funkcija, vse ostalo je logično sao to je bullshit*/
                    let savePromises = answers.map(answer => {
                        if (answer.postedBy._id == req.session.userId) {
                            answer.isOwner = true;
                        }
                        else {
                            answer.isOwner = false;
                        }
                        return answer.save();
                    });                

                    Promise.all(savePromises).then(() => {
                        answers.sort(function(a, b) {
                            return b.isBest - a.isBest;
                        });

                        return res.render('question/displayQuestion', {question: question, answers: answers, 
                            commentsQuestion: question.commentsQuestion, commentsAnswer: answers.commentsAnswer}); 
                    })
                    .catch(err => {
                        return res.status(500).json({
                            message: 'Error when updating answers',
                            error: err
                        });
                    });
                });
            });
        });
    },


    /**
     * questionController.create()
     */
    create: function (req, res) {
        var question = new QuestionModel({
			title : req.body.title,
			body : req.body.body,
			postedBy : req.session.userId,
			created : Date.now(),
            createdDisplay : "",
            hasBestAnswer : false,
            isOwner : false,
            numberOfAnswers : 0,
            hotScore : {
                score : 0,
                timesArray : []
            }
        });

        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        var formattedDate = question.created.toLocaleDateString("en-US", options);
        var formattedTime = question.created.toLocaleTimeString("sl-SI", {hour: '2-digit', minute: '2-digit'});
        question.createdDisplay = formattedDate + ' at ' + formattedTime;

        question.save(function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating question',
                    error: err
                });
            }

            return res.redirect('/');
        });
    },

    /**
     * questionController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        QuestionModel.findOne({_id: id}, function (err, question) {
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

            question.title = req.body.title ? req.body.title : question.title;
			question.body = req.body.body ? req.body.body : question.body;
			question.postedBy = req.body.postedBy ? req.body.postedBy : question.postedBy;
			question.created = req.body.created ? req.body.created : question.created;
			
            question.save(function (err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating question.',
                        error: err
                    });
                }

                return res.json(question);
            });
        });
    },

    listHotQuestions: function (req, res) {
        QuestionModel.find()
        .populate('postedBy')
        .exec(function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }

            var data = [];
            data.length = 0;
            //console.log('Data before: ', data.questions);
            data.questions = QuestionModel.calculateHotness(questions); //to iz nekega razloga vrne zadno vprasanje in nevem zakaj, spodaj je workaround

            for (let i = data.questions.length - 1; i >= 0; i--) {
                if (data.questions[i].hotScore.score <= 0) {
                    data.questions.splice(i, 1);
                }
            }

            //console.log('Data: ', data.questions);
            return res.render('question/hotQuestions', data);
        });
    },

    /**
     * questionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        QuestionModel.findByIdAndRemove(id, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the question.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
