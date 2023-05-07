const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller.js')

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
        .post(userController.create)

router.route('/:userId')
        .get(userController.findOne)
        .delete(userController.delete)
        .put(userController.edit)
        .patch(userController.block)

//export this router
module.exports = router;