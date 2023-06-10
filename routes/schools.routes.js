const express = require('express');
const router = express.Router();

const schoolsController = require('../controllers/schools.controller');

router.route('/')
    .get(schoolsController.findAll)
    
router.route('/:schoolId')
    .get(schoolsController.findOne)

//export this router
module.exports = router;