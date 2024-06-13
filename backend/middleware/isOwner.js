function isOwner(req, res, next){
    try {
        if(req.user.userType === "admin" || req.user._id.toString() === req.params.id) {
            next();
        } else {
            res.status(401).json({ error: "You must be the owner to edit this" });
        }
    } catch(error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = isOwner