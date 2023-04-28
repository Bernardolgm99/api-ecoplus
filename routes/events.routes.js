const express = require('express');
const router = express.Router();

// import controllers middleware
const eventsController = require('../controllers/events.controller.js');
const verification = require('../utilities/validation.js');


router.route('/')
    .get(eventsController.findEvents)
    .post(verification.authenticate, eventsController.create);

//export this router
module.exports = router;