var RestaurantModel = require('../models/restaurantModel.js');

/**
 * restaurantController.js
 *
 * @description :: Server-side logic for managing restaurants.
 */
module.exports = {

    /**
     * restaurantController.list()
     */
    list: function (req, res) {
        var filter = {};
        var sort = {};
        if(req.query.name) {
            filter.name = { $regex: req.query.name };
        }
        if(req.query.sortBy) {
            if(req.query.sortBy === 'lowest-price-first') {
                sort.mealSurcharge = 1;
            } else if (req.query.sortBy === 'highest-price-first') {
                sort.mealSurcharge = -1;
            } else if (req.query.sortBy === 'lowest-rated-first') {
                sort.rating = 1;
            } else if (req.query.sortBy === 'highest-rated-first') {
                sort.rating = -1;
            }
        }
        RestaurantModel.find(filter)
        .sort(sort)
        .populate('tags')
        .then(restaurants => {
            return res.json(restaurants);
        }).catch(err => {
            return res.status(500).json({
                message: 'Error when getting restaurants.',
                error: err
            });
        });
    },

    listNear: function (req, res) {
        //Maribor -> [Longtitude, Latitude]
        var coords = [15.645886, 46.554628];
        if(req.query.lon, req.query.lat) {
            coords = [req.query.lon, req.query.lat];
        }
        var maxDistance = 100000;
        if(req.query.distance) {
            maxDistance = req.query.distance
        }
        var filter = {
            location: {
              $near: {
                $geometry: {
                   type: "Point" ,
                   coordinates: coords
                },
                $maxDistance: maxDistance
              }
            }
         }
        RestaurantModel.find(filter)
        .populate('tags')
        .then(restaurants => {
            return res.json(restaurants);
        }).catch(err => {
            return res.status(500).json({
                message: 'Error when getting restaurants.',
                error: err
            });
        });
    },

    /**
     * restaurantController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        RestaurantModel.findOne({_id: id})
        .populate('menus')
        .populate('ratings')
        .then(restaurant => {
            if (!restaurant) {
                return res.status(404).json({
                    message: 'No such restaurant'
                });
            }

            return res.json(restaurant);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting restaurant.',
                error: err
            });
        });
    },

    /**
     * restaurantController.create()
     */
    create: async function (req, res) {
        var coords;
        if(!req.body.coordinates) {
            var requestOptions = {
                method: 'GET',
            };
              
            var response = await fetch("https://api.geoapify.com/v1/geocode/search?text=" + req.body.address + "&apiKey=" + process.env.GEOCODING_API_KEY, requestOptions)
            var data = await response.json()
            
            const restaurantNameWords = req.body.name.toLowerCase().split(' ');
            var bestMatch = data.features[0];
            var bestMatchScore = 0;

            for(i in data.features) {
                if (!data.features[i].properties.name) continue;
                var featureName = data.features[i].properties.name.toLowerCase();
                var score = restaurantNameWords.reduce((acc, word) => acc + (featureName.includes(word) ? 1 : 0), 0);
                if(score > bestMatchScore) {
                    bestMatch = data.features[i];
                    bestMatchScore = score;
                }
            }
            coords = bestMatch.geometry
        } else {
            coords = req.body.coordinates;
        }

        var ownerId = req.user._id;
        if(req.body.owner && req.user.userType === 'admin') {
            ownerId = req.body.owner;
        }

        var restaurant = new RestaurantModel({
			name : req.body.name,
			address : req.body.address,
            owner : ownerId,
            photo : process.env.DEFAULT_RESTAURANT_PHOTO_ID,
			mealPrice : req.body.mealPrice,
			mealSurcharge : req.body.mealSurcharge,
			workingHours : req.body.workingHours,
			location : coords,
        });

        restaurant.save()
        .then(restaurant => {
            return res.status(201).json(restaurant)
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when creating restaurant',
                error: err
            });
        });
    },

    rate: function (req, res) {
        var id = req.params.id;
        var score = req.query.score;

        RestaurantModel.findOne({_id: id})
        .then(restaurant => {
            if (!restaurant) {
                return res.status(404).json({
                    message: 'No such restaurant'
                });
            }

            const ratingIndex = restaurant.ratings.findIndex(rating => rating.user.toString() === req.user._id);

            if (ratingIndex !== -1) {
                restaurant.ratings[ratingIndex].score = Number(score);
            } else {
                restaurant.ratings.push({
                    user: req.user._id,
                    score: Number(score)
                });
            }
			
            restaurant.save()
            .then(restaurant => {
                return res.json(restaurant);
            })
            .catch(err => {
                return res.status(500).json({
                    message: 'Error when rating restaurant.',
                    error: err
                });
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting restaurant',
                error: err
            });
        });
    },

    /**
     * restaurantController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        var ownerId = req.user._id;
        if(req.body.owner && req.user.userType === 'admin') {
            ownerId = req.body.owner;
        }

        RestaurantModel.findOne({_id: id})
        .then(restaurant => {
            if (!restaurant) {
                return res.status(404).json({
                    message: 'No such restaurant'
                });
            }

            var coords = restaurant.coords;
            if(req.body.address !== restaurant.address) {
                if(!req.body.coordinates) {
                    //Poišči koordinate
                } else {
                    coords = req.body.coordinates;
                }
            }

            restaurant.name = req.body.name ? req.body.name : restaurant.name;
			restaurant.address = req.body.address ? req.body.address : restaurant.address;
            restaurant.owner = ownerId;
            restaurant.photo = req.body.photo ? req.body.photo : restaurant.photo;
			restaurant.mealPrice = req.body.mealPrice ? req.body.mealPrice : restaurant.mealPrice;
			restaurant.mealSurcharge = req.body.mealSurcharge ? req.body.mealSurcharge : restaurant.mealSurcharge;
			restaurant.workingHours = req.body.workingHours ? req.body.workingHours : restaurant.workingHours;
			restaurant.coordinates = coords;
			
            restaurant.save()
            .then(restaurant => {
                return res.json(restaurant);
            })
            .catch(err => {
                return res.status(500).json({
                    message: 'Error when updating restaurant.',
                    error: err
                });
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting restaurant',
                error: err
            });
        });
    },

    /**
     * restaurantController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        RestaurantModel.findOneAndDelete({ _id: id })
        .then(restaurant => {
            if (!restaurant) {
                return res.status(404).json({
                    message: 'No such restaurant'
                });
            }
            return res.status(204).json();
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when deleting the restaurant.',
                error: err
            });
        });
    }
};
