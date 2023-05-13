const express = require('express');
const router = express.Router();

// import controllers middleware
const eventsController = require('../controllers/events.controller.js');
const auth = require('../controllers/auth.controller');


router.route('/')
    .get(eventsController.findEvents)
    .post(auth.verifyToken, eventsController.create);

//export this router
module.exports = router;