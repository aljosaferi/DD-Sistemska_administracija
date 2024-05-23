var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var PhotoModel = require('../models/photoModel.js');

var router = express.Router();
var photoController = require('../controllers/photoController.js');

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
        PhotoModel.findById(req.params.id, function(err, foundPhoto){
            if(err || !foundPhoto){
                res.status(500).send();
            } else {
                if(foundPhoto.postedBy.equals(req.session.userId)){
                    next();
                } else {
                    res.status(403).send();
                }
            }
        });
    }
    else {
        var err = new Error("You must be the owner of this photo to edit it");
        err.status = 401;
        return next(err);
    }
}

router.get('/', photoController.list);
//router.get('/publish', requiresLogin, photoController.publish);
router.get('/:id', photoController.show);

router.post('/', requiresLogin, upload.single('image'), photoController.create);
router.post('/:id/like', requiresLogin, photoController.like);
router.post('/:id/flag', requiresLogin, photoController.flag);

router.put('/:id', checkOwnership ,photoController.update);

router.delete('/:id', checkOwnership ,photoController.remove);

module.exports = router;
