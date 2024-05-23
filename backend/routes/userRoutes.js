var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

var UserModel = require('../models/userModel.js');

function checkOwnership(req, res, next){
    if(req.session && req.session.userId) {
        UserModel.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                res.status(500).send();
            } else {
                if(foundUser._id.equals(req.session.userId)){
                    next();
                } else {
                    res.status(403).send();
                }
            }
        });
    }
    else {
        var err = new Error("You must be the owner of this account to edit it");
        err.status = 401;
        return next(err);
    }
}

router.get('/', userController.list);
//router.get('/register', userController.showRegister);
//router.get('/login', userController.showLogin);
router.get('/profile', userController.profile);
router.get('/logout', userController.logout);
router.get('/:id', userController.show);

router.post('/', userController.create);
router.post('/login', userController.login);

router.put('/:id', checkOwnership ,userController.update);

router.delete('/:id', checkOwnership ,userController.remove);

module.exports = router;
