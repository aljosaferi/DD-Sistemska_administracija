function isRestaurantOwner(req, res, next){
    try {
        if(req.user.userType === "admin" || req.user.userType === "restaurantOwner") {
            if(req.user.pendingApproval === false) {
                next();
            } else {
                res.status(401).json({ error: "You must get approved before you can add restaurants" });
            }
        } else {
            res.status(401).json({ error: "You must be an restaurantOwner to edit this" });
        }
    } catch(error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = isRestaurantOwner