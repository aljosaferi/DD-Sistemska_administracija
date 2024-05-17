var UserModel = require('../models/userModel.js');
var PhotoModel = require('../models/photoModel.js');
var CommentModel = require('../models/commentModel.js');
var ReplyModel = require('../models/replyModel.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

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

        UserModel.findOne({_id: id})
        .populate('photos')
        .exec(function (err, user) {
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

            CommentModel.countDocuments({ postedBy: user._id }, function(err, count) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting comments.',
                        error: err
                    });
                }

                return res.json({...user._doc, commentCount: count});
            });
        });
    },

    /**
     * userController.create()
     */
    create: async function (req, res) {

        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: 'secret=6LfOb9YpAAAAANrtEz5UebMvd4J4tSXevShXN2ku&response=' + req.body.captchaToken,
        });
        const data = await response.json()

        if(data.success) {

            var user = new UserModel({
			    username : req.body.username,
			    password : req.body.password,
			    email : req.body.email
            });

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating user',
                        error: err
                    });
                }

                return res.status(201).json(user);
            });
        } else {
            return res.status(500).json({
                message: 'ReCAPCHA failed',
                error: "failed"
            });
        }
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

        UserModel.findById(id)
        .populate({
            path: 'photos',
            populate: [{
                    path: 'comments',
                    populate: [{ path: 'replies' }]
                }]
        })
        .exec(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            var commentIds = user.photos.flatMap(photo => photo.comments.map(comment => comment._id));
            ReplyModel.deleteMany({ comment: { $in: commentIds } }, function(err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the replies.',
                        error: err
                    });
                }

                CommentModel.deleteMany({ photo: { $in: user.photos.map(photo => photo._id) } }, function(err) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the comments.',
                            error: err
                        });
                    }

                    PhotoModel.deleteMany({ user: user._id }, function(err) {
                        if(err){
                            return res.status(500).json({
                                message: 'Error when deleting the photos.',
                                error: err
                            });
                        }

                        UserModel.findByIdAndRemove(id, function (err, user) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when deleting the user.',
                                    error: err
                                });
                            }
            
                            if (!user) {
                                return res.status(404).json({
                                    message: 'No such user'
                                });
                            }
                
                            return res.status(204).json();
                        });
                    });
                });
            });
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
            //res.redirect('/users/profile');
            return res.json(user);
        });
    },

    profile: function(req, res,next){
        UserModel.findById(req.session.userId)
        .populate('photos')
        .populate('comments')
        .exec(function(error, user){
            if(error){
                return next(error);
            } else{
                if(user===null){
                    var err = new Error('Not authorized, go back!');
                    err.status = 400;
                    return next(err);
                } else{
                    //return res.render('user/profile', user);
                    return res.json(user);
                    console.log(user)
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
                    //return res.redirect('/');
                    return res.status(201).json({});
                }
            });
        }
    }
};
