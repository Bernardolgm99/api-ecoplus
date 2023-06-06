const express = require('express');
const router = express.Router({mergeParams: true});

// import controllers middleware
const commentsController = require('../controllers/comments.controller.js')
const badgesController = require('../controllers/badges.controller.js')
const ratingRouter = require('../routes/rating.routes.js')
const auth = require('../controllers/auth.controller.js')

router.use('/:commentId/rating', ratingRouter)

router.route('/')
    .post(auth.verifyToken, commentsController.create, badgesController.verifyComment)
    .get(auth.autheticationNotNeeded, commentsController.findAll)

router.route('/:commentId')
    .get(commentsController.findOne)
    .put(auth.verifyToken, commentsController.edit)
    .delete(auth.verifyToken, commentsController.delete)

    //export this router
module.exports = router;