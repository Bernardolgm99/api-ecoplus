const db = require("../models/index.js");
const User = db.User;

exports.findAll = async (req, res) => {
    try {
     
      // try to find the tutorial, given its ID
      let tutorial = await User.findAll();
      res.status(201).json({
        success: true,
        msg: tutorial
      });
    
    } catch (err) {
  
     
          res.status(500).json({
              success: false,
              msg: err.message
              || `Some error occurred while adding a comment to tutorial with ID `
          });
        }
  };