var express = require('express');
var router = express.Router();
var answerController = require('../controllers/answerController.js');

router.get('/questions/:questionId/answers', answerController.list);

router.post('/newAnswer', answerController.create);
router.post('/updateLikes', answerController.updateLikes);
router.post('/markBest', answerController.markBest);
router.post('/unmarkBest', answerController.unmarkBest);
router.post('/deleteAnswer', answerController.deleteAnswer);

module.exports = router;
