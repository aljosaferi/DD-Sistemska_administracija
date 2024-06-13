var express = require('express');
var router = express.Router();
var restaurantController = require('../controllers/restaurantController.js');

var JWTAuthenticate = require('../middleware/cookieJWTAuth');
var isRestaurantOwner = require('../middleware/isRestaurantOwner');

var UserModel = require('../models/userModel')

function checkOwnership(req, res, next){
    UserModel.findOne({_id: req.user._id})
    .populate('restaurants')
    .then(user => {
        if(!user) {
            res.status(404).json({ error: 'No such user' });
        }

        if(req.user.userType === "admin" || (user.restaurants && user.restaurants.some(restaurant => restaurant._id.toString() === req.params.id))) {
            next();
        } else {
            res.status(401).json({ error: "You must be the owner of this restaurant to edit it" });
        }
    })
    .catch(error => {
        res.status(500).json({ error: 'Server error' });
    });
}

//GET
router.get('/', restaurantController.list);
router.get('/near', restaurantController.listNear);
router.get('/:id', restaurantController.show);

//POST
router.post('/', JWTAuthenticate, isRestaurantOwner, restaurantController.create);
router.post('/:id/rate', JWTAuthenticate, restaurantController.rate);

//PUT
router.put('/:id', JWTAuthenticate, isRestaurantOwner, checkOwnership, restaurantController.update);

//DELETE
router.delete('/:id', JWTAuthenticate, isRestaurantOwner, checkOwnership, restaurantController.remove);

module.exports = router;
