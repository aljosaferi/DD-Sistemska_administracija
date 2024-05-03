var UserModel = require('../models/userModel.js');

var AnswerModel = require('../models/answerModel.js');
var QuestionModel = require('../models/questionModel.js');
var PhotoModel = require('../models/photoModel.js');
const photoModel = require('../models/photoModel.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    addProfilePicture: function(req, res){
        UserModel.findById(req.session.userId)
        .exec(function (err, user)
        {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            user.hasProfilePicture = true;
            user.profilePicturePath = "/images/"+req.file.filename;
            req.session.profilePicture = user.profilePicturePath;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating photo',
                        error: err
                    });
                }
    
                return res.redirect('/users/profile');
            });
        });
    },

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    displayProfile: function(req, res,next){
        UserModel.findById(req.params.id)
        .exec(function(error, user){
            if(error){
                return next(error);
            } else{
                if(user===null){
                    var err = new Error('Not authorized, go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    
                    QuestionModel.find({postedBy: req.params.id})
                        .populate('postedBy') //avtomatsko zamenja id s celotnim uporabnikom
                        
                        .exec(function (err, questions) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when getting photo.',
                                    error: err
                                });
                            }

                            QuestionModel.countDocuments({postedBy: req.params.id}, function(err, questionCount) {
                                if(err) {
                                    return res.status(500).json({
                                        message: 'Error when getting question count.',
                                        error: err
                                    });
                                }

                                console.log(questionCount);
    
                                AnswerModel.find({postedBy: req.params.id})
                                .populate('postedBy')
                                .populate('questionReference')
                                .exec(function (err, answers) {
                                    if (err) {
                                        return res.status(500).json({
                                            message: 'Error when getting photo.',
                                            error: err
                                        });
                                    }

                                    AnswerModel.countDocuments({postedBy: req.params.id}, function(err, answerCount) {
                                        if(err) {
                                            return res.status(500).json({
                                                message: 'Error when getting answer count.',
                                                error: err
                                            });
                                        }

                                        return res.render('user/displayProfile', {questions: questions, answers: answers, user: user, numberOfQuestions: questionCount, numberOfAnswers: answerCount});
                                    });
                                });
                            });
                        });
                        }
            
                    }
                });
            },
        
    
    /**
     * userController.create()
     */
    create: function (req, res) {
        var user = new UserModel({
			username : req.body.username,
			password : req.body.password,
			email : req.body.email,
            hasProfilePicture : false,
            profilePicturePath : "/images/a233696b0a58685a0d73f84b929cf8b4",
            numberOfAnswers : 0,
            numberOfQuestions : 0,
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            //return res.status(201).json(user);
            return res.redirect('/users/login');
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			user.email = req.body.email ? req.body.email : user.email;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    showRegister: function(req, res){
        res.render('user/register');
    },

    showLogin: function(req, res){
        res.render('user/login');
    },

    login: function(req, res, next){
        UserModel.authenticate(req.body.username, req.body.password, function(err, user){
            if(err || !user){
                var err = new Error('Wrong username or password');
                
                err.status = 401;
                return next(err);
            }
            req.session.userId = user._id;
            req.session.username = user.username;
            req.session.profilePicture = user.profilePicturePath;
            res.redirect('/users/profile');
        });
    },

    profile: function(req, res,next){
        UserModel.findById(req.session.userId)
        .exec(function(error, user){
            if(error){
                return next(error);
            } else{
                if(user===null){
                    var err = new Error('Not authorized, go back!');
                    err.status = 400;
                    return next(err);
                } else{
                    return res.render('user/profile', user);
                }
            }
        });  
    },

    logout: function(req, res, next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else{
                    return res.redirect('/');
                }
            });
        }
    }
};
