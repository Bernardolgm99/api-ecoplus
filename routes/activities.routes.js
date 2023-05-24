const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activities.controller')
const commentsRouter = require('../routes/comments.routes.js')
const auth = require('../controllers/auth.controller')

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

router.use('/:id/comments', commentsRouter)

router.route('/')
  .post(auth.verifyToken, activityController.create)
  .get(activityController.findAll)
router.route('/:activityId')
  .get(activityController.findOne)
  .put(auth.verifyToken, activityController.edit)
  .delete(auth.verifyToken, activityController.delete)
router.route('/:activityId/users')
  .post(auth.verifyToken, activityController.subscribe)
  .delete(auth.verifyToken, activityController.unsubscribe)
  .get(activityController.getAllsubscribed)
//export this router
module.exports = router;