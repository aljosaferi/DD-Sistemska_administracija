var express = require('express');
var router = express.Router();
var replyController = require('../controllers/replyController.js');

var ReplyModel = require('../models/replyModel.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

function checkOwnership(req, res, next){
    if(req.session && req.session.userId) {
        ReplyModel.findById(req.params.id, function(err, foundReply){
            if(err || !foundReply){
                res.status(500).send();
            } else {
                if(foundReply.postedBy.equals(req.session.userId)){
                    next();
                } else {
                    res.status(403).send();
                }
            }
        });
    }
    else {
        var err = new Error("You must be the owner of this comment to edit it");
        err.status = 401;
        return next(err);
    }
}

/*
 * GET
 */
router.get('/', replyController.list);

/*
 * GET
 */
router.get('/:id', replyController.show);

/*
 * POST
 */
router.post('/', requiresLogin, replyController.create);

/*
 * PUT
 */
router.put('/:id', checkOwnership, replyController.update);

/*
 * DELETE
 */
router.delete('/:id', checkOwnership, replyController.remove);

module.exports = router;
