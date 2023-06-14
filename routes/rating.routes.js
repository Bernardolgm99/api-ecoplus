const express = require('express');
const router = express.Router({mergeParams: true});

// import controllers middleware
const ratingController = require('../controllers/rating.controller.js')
const auth = require('../controllers/auth.controller.js')
const logsController = require('../controllers/logs.controller.js');

router.route('/')
    .get(ratingController.getAll)
    .put(auth.verifyToken, ratingController.like, logsController.createLog)
    .delete(auth.verifyToken, ratingController.delete, logsController.createLog)


//export this router
module.exports = router;