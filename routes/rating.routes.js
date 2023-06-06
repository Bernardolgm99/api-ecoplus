const express = require('express');
const router = express.Router({mergeParams: true});

// import controllers middleware
const ratingController = require('../controllers/rating.controller.js')
const auth = require('../controllers/auth.controller.js')

router.route('/')
    .get(ratingController.getAll)
    .put(auth.verifyToken, ratingController.like)
    .patch(auth.verifyToken, ratingController.delete)


//export this router
module.exports = router;