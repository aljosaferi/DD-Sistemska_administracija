var express = require('express');
var router = express.Router();
var questionController = require('../controllers/questionController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to ask a question");
        err.status = 401;
        return next(err);
    }
}

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', questionController.list);
router.get('/newQuestion', questionController.showNewQuestionForm);
router.get('/myQuestions', questionController.listMyQuestions);
router.get('/hotQuestions', questionController.listHotQuestions);
router.get('/:id', questionController.show);

router.post('/', requiresLogin, questionController.create);
router.post('/removeQuestion', questionController.removeQuestion);

module.exports = router;
