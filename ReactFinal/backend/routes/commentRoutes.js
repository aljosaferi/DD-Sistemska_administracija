var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController.js');

var multer  = require('multer');
var upload = multer();

/*
 * GET
 */
router.get('/', commentController.list);

router.get('/photo/:id', commentController.listByPhoto);
/*
 * GET
 */
router.get('/:id', commentController.show);

/*
 * POST
 */
router.post('/', upload.none(), commentController.create);

/*
 * PUT
 */
router.put('/:id', commentController.update);

/*
 * DELETE
 */
router.delete('/:id', commentController.remove);

module.exports = router;
