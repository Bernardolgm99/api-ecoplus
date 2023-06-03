const express = require('express');
const router = express.Router();

// import controllers middleware
const eventsController = require('../controllers/events.controller.js');
const badgesController = require('../controllers/badges.controller.js');
const commentsRouter = require('../routes/comments.routes.js');
const auth = require('../controllers/auth.controller');

router.use('/:eventId/comments', commentsRouter)

router.route('/')
    .get(eventsController.findAll)
    .post(auth.verifyToken, eventsController.create);

router.route('/:eventId')
    .get(eventsController.findByID)
    .put(auth.verifyToken, eventsController.edit)
    .delete(auth.verifyToken, eventsController.delete);

router.route('/:eventId/users')
    .post(auth.verifyToken, eventsController.subscribe, badgesController.verifyEvent)
    .delete(auth.verifyToken, eventsController.unsubscribe)
    .get(eventsController.getAllSubscribed)


//export this router
module.exports = router;