const express = require('express');
const router = express.Router();

// import controllers middleware
const occurrencesController = require('../controllers/occurrences.controller');
const verification = require('../utilities/validation');


router.route('/')
    .get(occurrencesController.findAll)
    .post(verification.authenticate, occurrencesController.create);

router.route('/:id')
    .get(occurrencesController.findByID)
    .put(verification.authenticate, occurrencesController.edit)
    .patch(verification.authenticate, occurrencesController.editStatus)
    .delete(verification.authenticate, occurrencesController.delete);

//export this router
module.exports = router;