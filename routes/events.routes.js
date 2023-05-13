const express = require('express');
const router = express.Router();

// import controllers middleware
const eventsController = require('../controllers/events.controller.js');
const auth = require('../controllers/auth.controller');


router.route('/')
    .get(eventsController.findAll)
    .post(auth.verifyToken, eventsController.create);

router.route('/:id')
    .get(eventsController.findByID)
    .put(auth.verifyToken, eventsController.edit)
    .delete(auth.verifyToken, eventsController.delete);

//export this router
module.exports = router;