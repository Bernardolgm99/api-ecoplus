const express = require('express');
const router = express.Router();

// import controllers middleware
const badgesController = require('../routes/badges.controller.js')
const auth = require('../controllers/auth.controller');

router.route('/')
    .get(eventsController.findAll)
    .post(auth.verifyToken, eventsController.create);

router.route('/:id')
    .get(badgesController.findByID)
    .put(auth.verifyToken, badgesController.edit)
    .delete(auth.verifyToken, badgesController.delete);

//export this router
module.exports = router;