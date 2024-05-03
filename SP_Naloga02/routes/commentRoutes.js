var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController.js');

router.post('/newCommentQuestion', commentController.createCommentQuestion);
router.post('/newCommentAnswer', commentController.createCommentAnswer);

module.exports = router;
