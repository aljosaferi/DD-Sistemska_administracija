var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var router = express.Router();
var photoController = require('../controllers/photoController.js');

var JWTAuthenticate = require('../middleware/cookieJWTAuth');
var isRestaurantOwner = require('../middleware/isRestaurantOwner');

var UserModel = require('../models/userModel')

function checkPhotoOwnership(req, res, next){
    UserModel.findOne({_id: req.user._id})
    .then(user => {
        if(!user) {
            res.status(404).json({ error: 'No such user' });
        }

        if(req.user.userType === "admin" || user.profilePhoto.toString() === req.params.id) {
            next();
        } else {
            res.status(401).json({ error: "You must be the owner of this photo to edit it" });
        }
    })
    .catch(error => {
        res.status(500).json({ error: 'Server error' });
    });
}

function checkRestaurantOwnership(req, res, next){
    UserModel.findOne({_id: req.user._id}).populate('restaurants')
    .then(user => {
        if(!user) {
            res.status(404).json({ error: 'No such user' });
        }

        if(req.user.userType === "admin" || user.restaurants && user.restaurants.some(restaurant => restaurant._id.toString() === req.params.restaurantId)) {
            next();
        } else {
            res.status(401).json({ error: "You must be the owner of this photo to edit it" });
        }
    })
    .catch(error => {
        res.status(500).json({ error: 'Server error' });
    });
}

//GET
router.get('/', photoController.list);
router.get('/:id', photoController.show);

//POST
router.post('/profilePhoto', JWTAuthenticate, upload.single('image'), photoController.createProfilePhoto);
router.post('/restaurantPhoto/:restaurantId', JWTAuthenticate, isRestaurantOwner, checkRestaurantOwnership, upload.single('image'), photoController.createRestaurantPhoto);

//PUT
router.put('/:id', JWTAuthenticate, checkPhotoOwnership, photoController.update);

//DELETE
router.delete('/profilePhoto/:id', JWTAuthenticate, checkPhotoOwnership, photoController.removeProfilePhoto);
router.delete('/restaurantPhoto/:restaurantId/:id', JWTAuthenticate, isRestaurantOwner, checkRestaurantOwnership, photoController.removeRestaurantPhoto);

module.exports = router;
