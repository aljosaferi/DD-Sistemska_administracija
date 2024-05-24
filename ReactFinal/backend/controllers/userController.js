var UserModel = require('../models/userModel.js');
var PhotoModel = require('../models/photoModel.js');


const axios = require('axios');
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    

    getProfilePhoto: function(req, res){
        console.log("SERBUS: "+ req.user.id);
        UserModel.findById(req.session.id, function(err, user){
            if(err){
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if(!user){
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            console.log("HELLO: " + user.profilePicturePath);


            // Find the photo object whose path matches the user's profilePicturePath
            PhotoModel.findOne({ path: user.profilePicturePath }, function(err, photo) {
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

                console.log(photo);
                return res.json(photo);
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

    /**
     * userController.create()
     */
    
    create: async function (req, res) {
        const RECAPTCHA_SECRET_KEY = '6LeYlM8pAAAAADVle7IAWcFZ6CEALyxIAEnlQyzJ';
        const captcha = req.body.captcha;
        if(!captcha){
            return res.status(400).json({
                message: 'CAPTCHA not verified',
                error: 'CAPTCHA is required'
            });
        }
    
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captcha}`; //to more bit bol skrito shranjeno
        const response = await axios.post(verifyUrl);
        const body = response.data;
    
        if(body.success !== undefined && !body.success){
            return res.status(403).json({
                message: 'Failed captcha verification'
            });
        }
    
        var user = new UserModel({
            username : req.body.username,
            password : req.body.password,
            email : req.body.email,
            numberOfPosts : 0,
            numberOfComments : 0,
            profilePicturePath : '/images/2208f06c088f77c146a928f0107a924a'
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
                var err = new Error('Wrong username or paassword');
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
        .exec(function(error, user){
            if(error){
                return next(error);
            } else{
                if(user===null){
                    var err = new Error('Not authorized, go back!');
                    err.status = 400;
                    return next(err);
                } else{
                    PhotoModel.find({ postedBy: user._id }, function(err, photos) {
                        if (err) {
                            return next(err);
                        }
    
                        var totalLikes = photos.reduce(function(sum, photo) {
                            return sum + photo.likes;
                        }, 0);
    
                        user = user.toObject();
                        console.log(user);
                        user.totalLikes = totalLikes;
    
                        return res.json(user);
                    });
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
