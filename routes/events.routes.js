const express = require('express');
const router = express.Router();

// import controllers middleware
const eventsController = require('../controllers/events.controller.js');
const commentsRouter = require('../routes/comments.routes.js')
const auth = require('../controllers/auth.controller');

router.use('/:id/comments', commentsRouter)

router.route('/')
    .get(eventsController.findAll)
    .post(auth.verifyToken, eventsController.create);

router.route('/:eventId')
    .get(eventsController.findByID)
    .put(auth.verifyToken, eventsController.edit)
    .delete(auth.verifyToken, eventsController.delete);

router.route('/:eventId/users')
    .post(auth.verifyToken, activityController.subscribe)
    .delete(auth.verifyToken, activityController.unsubscribe)
    .get(activityController.getAllSubscribed)


//export this router
module.exports = router;