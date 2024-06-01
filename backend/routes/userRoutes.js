var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

var JWTAuthenticate = require('../middleware/cookieJWTAuth');
var isOwner = require('../middleware/isOwner');

// GET
router.get('/', userController.list);
router.get('/logout', userController.logout);
router.get('/:id', userController.show);

//POST
router.post('/', userController.create);
router.post('/login', userController.login);

//PUT
router.put('/:id', JWTAuthenticate, isOwner, userController.update);

//DELETE
router.delete('/:id', JWTAuthenticate, isOwner, userController.remove);

module.exports = router;
