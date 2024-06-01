function isRestaurantOwner(req, res, next){
    try {
        if(req.user.userType === "admin" || req.user.userType === "restaurantOwner") {
            next();
        } else {
            res.status(401).json({ error: "You must be an restaurantOwner to edit this" });
        }
    } catch(error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = isRestaurantOwner