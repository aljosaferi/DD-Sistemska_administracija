var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view your profile");
        err.status = 401;
        return next(err);
    }
}

router.get('/', userController.list);
router.get('/register', userController.showRegister);
router.get('/login', userController.showLogin);
router.get('/profile', requiresLogin, userController.profile);
router.get('/logout', requiresLogin, userController.logout);
router.get('/displayProfile/:id', userController.displayProfile);
router.get('/:id', userController.show);

router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/addProfilePicture', upload.single('image'), userController.addProfilePicture);

router.put('/:id', userController.update);

router.delete('/:id', userController.remove);

module.exports = router;
