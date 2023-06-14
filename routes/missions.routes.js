const express = require('express');
const router = express.Router({mergeParams: true});

const missionsController = require('../controllers/missions.controller');
const auth = require('../controllers/auth.controller');

router.route('/')
    .get(missionsController.findAll)
    .post(auth.verifyToken, missionsController.create)

router.route('/:missionId')
    .get(missionsController.findOneById)
    .put(auth.verifyToken, missionsController.edit)
    .delete(auth.verifyToken, missionsController.delete)

module.exports = router;