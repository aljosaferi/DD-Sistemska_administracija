var jwt = require("jsonwebtoken");
var UserModel = require('../models/userModel.js');

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
        UserModel.find()
        .select('-password')
        .populate('profilePhoto')
        .then(users => {
            return res.json(users);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting users.',
                error: err
            });
        })
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
    
        UserModel.findOne({_id: id})
        .select('-password')
        .populate('profilePhoto')
        .populate({
            path: 'restaurants',
            populate: { path: 'menus' }
        })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            return res.json(user);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting user.',
                error: err
            });
        });
    },

    /**
     * userController.create()
     */
    create: async function (req, res) {
        if(req.body.userType === "admin") {
            try {
                const user = await UserModel.findById(req.user._id);
                if(!user) {
                    return res.status(404).json({
                        message: 'User does not exist',
                    });
                }
    
                if(user.userType !== "admin") {
                    return res.status(403).json({
                        message: "Non-admin users are not allowed to create admin accounts",
                    });
                }
            } catch(err) {
                return res.status(500).json({
                    message: 'Cannot create admin account',
                    error: err
                });
            }
        }

        var user = new UserModel({
            username : req.body.username,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : req.body.password,
            profilePhoto : process.env.DEFAULT_AVATAR_ID,
            userType : req.body.userType,
        });
    
        user.save()
        .then(user => {
            return res.status(201).json(user);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when creating user',
                error: err
            });
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id})
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
			user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
			user.email = req.body.email ? req.body.email : user.email;
			user.password = req.body.password ? req.body.password : user.password;
			
            user.save()
            .then(user => {
                return res.status(201).json(user);
            })
            .catch(err => {
                return res.status(500).json({
                message: 'Error when creating user',
                error: err
                });
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting user',
                error: err
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        UserModel.findOneAndDelete({ _id: id })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            if(req.user._id === user._id) {
                res.clearCookie('token');
            }
            return res.status(204).json();
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when deleting the user.',
                error: err
            });
        });
    },

    login: function(req, res, next){
        UserModel.authenticate(req.body.username, req.body.password, function(err, user){
            if(err || !user){
                var err = new Error('Wrong username or password');
                err.status = 401;
                return next(err);
            }

            const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '1h' })
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 3600000 // 1 hour in milliseconds
              });

            return res.json(user);
        });
    },

    logout: function(req, res, next){
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logged out successfully' });
    }
};
