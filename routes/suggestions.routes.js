const express = require('express');
const router = express.Router();
const suggestionsController = require('../controllers/suggestions.controller')
const auth = require('../controllers/auth.controller')

router.route('/')
    .post(auth.verifyToken, suggestionsController.create)
    .get(auth.verifyToken, suggestionsController.findAll)

router.route('/:suggestionId')
    .get(auth.verifyToken, suggestionsController.findOne)

//export this router
module.exports = router;