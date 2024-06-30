var express = require('express');
var router = express.Router();
var menuController = require('../controllers/menuController.js');

var JWTAuthenticate = require('../middleware/cookieJWTAuth');
var isRestaurantOwner = require('../middleware/isRestaurantOwner');

var UserModel = require('../models/userModel')

function isThisRestaurantsOwner(req, res, next) {
    UserModel.findOne({_id: req.user._id})
    .populate('restaurants')
    .then(user => {
        if(!user) {
            res.status(404).json({ error: 'No such user' });
        }

        if(req.user.userType === "admin" || (user.restaurants && user.restaurants.some(restaurant => restaurant._id.toString() === req.body.restaurantId))) {
            next();
        } else {
            res.status(401).json({ error: "You must be the owner of this restaurant to edit it's menus" });
        }
    })
    .catch(error => {
        res.status(500).json({ error: 'Server error' });
    });
}

function checkOwnership(req, res, next){
    UserModel.findOne({_id: req.user._id})
    .populate({
        path: 'restaurants',
        populate: { path: 'menus' }
    })
    .then(user => {
        if(!user) {
            res.status(404).json({ error: 'No such user' });
        }

        if(req.user.userType === "admin" || (user.restaurants && user.restaurants.some(restaurant => 
            restaurant.menus && restaurant.menus.some(menu => menu._id.toString() === req.params.id)))) {
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
router.get('/', menuController.list);
router.get('/:id', menuController.show);

//POST
router.post('/', JWTAuthenticate, isRestaurantOwner, isThisRestaurantsOwner, menuController.create);

//PUT
router.put('/:id', JWTAuthenticate, isRestaurantOwner, checkOwnership, menuController.update);

//DELETE
router.delete('/:id', JWTAuthenticate, isRestaurantOwner, checkOwnership, menuController.remove);

module.exports = router;
