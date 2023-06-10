const express = require('express');
const router = express.Router();

// import controllers middleware
const logsController = require('../controllers/logs.controller.js');

router.route('/')
    	.get(logsController.findAll)

//export this router
module.exports = router;