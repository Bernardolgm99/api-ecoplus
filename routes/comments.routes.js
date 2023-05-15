const express = require('express');
const router = express.Router({mergeParams: true});

// import controllers middleware
const commentsController = require('../controllers/comments.controller.js')
const auth = require('../controllers/auth.controller.js')

router.route('/')
    .post(auth.verifyToken, commentsController.create)
    .get(commentsController.findAll)

router.route('/:commentId')
    .get(commentsController.findOne)
    .put(auth.verifyToken, commentsController.edit)
    .delete(auth.verifyToken, commentsController.delete)
    .patch(commentsController.rating)

//export this router
module.exports = router;