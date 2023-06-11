const express = require('express');
const router = express.Router({mergeParams: true});

// import controllers middleware
const commentsController = require('../controllers/comments.controller.js')
const badgesController = require('../controllers/badges.controller.js')
const ratingRouter = require('../routes/rating.routes.js')
const auth = require('../controllers/auth.controller.js')
const logsController = require('../controllers/logs.controller.js');

router.use('/:commentId/rating', ratingRouter)

router.route('/')
    .post(auth.verifyToken, commentsController.create, badgesController.verifyComment, logsController.createLog)
    .get(auth.autheticationNotNeeded, commentsController.findAll)

router.route('/:commentId')
    .get(commentsController.findOne)
    .put(auth.verifyToken, commentsController.edit, logsController.createLog)
    .delete(auth.verifyToken, commentsController.delete, logsController.createLog)

    //export this router
module.exports = router;