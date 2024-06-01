function isAdmin(req, res, next){
    try {
        if(req.user.userType === "admin") {
            next();
        } else {
            res.status(401).json({ error: "You must be an admin to edit this" });
        }
    } catch(error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = isAdmin