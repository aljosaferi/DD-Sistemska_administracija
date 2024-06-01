var express = require('express');
var router = express.Router();
var tagController = require('../controllers/tagController.js');

var JWTAuthenticate = require('../middleware/cookieJWTAuth');
var isAdmin = require('../middleware/isAdmin');

//GET
router.get('/', tagController.list);
router.get('/:id', tagController.show);

//POST
router.post('/', JWTAuthenticate, isAdmin, tagController.create);

//PUT
router.put('/:id', JWTAuthenticate, isAdmin, tagController.update);

//DELETE
router.delete('/:id', JWTAuthenticate, isAdmin, tagController.remove);

module.exports = router;
