const express = require('express');
const router = express.Router();

const eventsOccurrencesController = require('../controllers/eventsOccurrences.controller.js');

router.route('/')
    .get(eventsOccurrencesController.findAll);

module.exports = router;