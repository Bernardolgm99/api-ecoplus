const express = require('express');
const router = express.Router({mergeParams: true});

// import controllers middleware
const commentsController = require('../controllers/comments.controller.js')
const auth = require('../controllers/auth.controller.js')

router.route('/')
    .post(commentsController.create)
    .get(commentsController.findAll)

router.route('/:commentId')
    .get(commentsController.findOne)
    .put(commentsController.edit)
    .delete(commentsController.delete)
    .patch(commentsController.rating)

//export this router
module.exports = router;