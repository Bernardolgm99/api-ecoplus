const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller.js')
const authController = require('../controllers/auth.controller.js')
const logsController = require('../controllers/logs.controller.js');


// middleware for all routes related with tutorials
// can be cleared, being used just for testing purposes
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      // finish event is emitted once the response is sent to the client
      const diffSeconds = (Date.now() - start) / 1000; // figure out how many seconds elapsed
      console.log(
        `${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`
      );
    });
    next();
  });

router.route('/')
        .get(userController.findAll)
        .post(userController.create, logsController.createLog)

router.route('/login')
        .post(userController.login, logsController.createLog)

router.route('/loggedUser')
        .get(authController.verifyToken, userController.findOne)
        
router.route('/:userId')
        .get(userController.findOne)
        .delete(authController.verifyToken, userController.delete, logsController.createLog)
        .put(authController.verifyToken, userController.edit, logsController.createLog)
        .patch(authController.verifyToken, userController.block, logsController.createLog)

router.route('/:userId/eventsOccurrences')
        .get(userController.findAllEventsOccurrences)

router.route('/:userId/events')
        .get(userController.findAllEvents)

router.route('/:userId/occurrences')
        .get(userController.findAllOccurrences)
//export this router
module.exports = router;