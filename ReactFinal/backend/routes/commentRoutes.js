var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController.js');

var CommentModel = require('../models/commentModel.js');

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
        CommentModel.findById(req.params.id, function(err, foundComment){
            if(err || !foundComment){
                res.status(500).send();
            } else {
                if(foundComment.postedBy.equals(req.session.userId)){
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
router.get('/', commentController.list);

/*
 * GET
 */
router.get('/:id', commentController.show);

/*
 * POST
 */
router.post('/', requiresLogin ,commentController.create);
router.post('/:id/like', requiresLogin, commentController.like);

/*
 * PUT
 */
router.put('/:id', checkOwnership, commentController.update);

/*
 * DELETE
 */
router.delete('/:id', checkOwnership, commentController.remove);

module.exports = router;
