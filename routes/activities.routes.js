const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activities.controller')

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
  .put(activityController.create)
  .get(activityController.findAll)
router.route('/:idA')
  .get(activityController.findOne)
  .put(activityController.edit)
  .delete(activityController.delete)
//export this router
module.exports = router;