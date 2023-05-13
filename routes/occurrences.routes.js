const express = require('express');
const router = express.Router();

// import controllers middleware
const occurrencesController = require('../controllers/occurrences.controller');
const auth = require('../controllers/auth.controller');


router.route('/')
    .get(occurrencesController.findAll)
    .post(auth.verifyToken, occurrencesController.create);

router.route('/:id')
    .get(occurrencesController.findByID)
    .put(auth.verifyToken, occurrencesController.edit)
    .patch(auth.verifyToken, occurrencesController.editStatus)
    .delete(auth.verifyToken, occurrencesController.delete);

//export this router
module.exports = router;