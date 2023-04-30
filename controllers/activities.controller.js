const db = require("../models/index.js");
const Activity = db.activity;

exports.create = async (req, res) => {
    try {
     
      // try to find the tutorial, given its ID
      let tutorial = await Tutorial.findByPk(req.params.idT);
      
      if (tutorial === null)
        return res.status(404).json({
          success: false,
          msg: `Cannot find any tutorial with ID ${req.params.idT}.`,
        });
      // save Comment in the database
      let newComment = await Comment.create(req.body);
      
      // add Comment to found tutorial (using a mixin)
      await tutorial.addComment(newComment);
      res.status(201).json({
        success: true,
        msg: `Comment added to tutorial with ID ${req.params.idT}.`,
        URL: `/tutorials/${req.params.idT}/comments/${newComment.id}`,
      });
    } catch (err) {
  
      if (err instanceof ValidationError)
          res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
      else
          res.status(500).json({
              success: false,
              msg: err.message
              || `Some error occurred while adding a comment to tutorial with ID ${req.params.idT}.`
          });
      };    
  };
