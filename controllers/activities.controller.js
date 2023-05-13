const db = require("../models/index.js");
const Activity = db.activity;
const { ValidationError } = require('sequelize'); //necessary for model validations using sequelize

exports.create = async (req, res) => {
  const date = new Date();
  const todayDate = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2);
  try {
    if(req.loggedUser.role == 'admin') {
      if(req.body.start <= todayDate || req.body.start >= req.body.end || req.body.end <= todayDate)
        return res.status(400).json({
          success: false,
          msg: 'Please provide a valid date'
        })
      let activity = await Activity.create(req.body)
      return res.status(201).json({
        success: true,
        message: `Activity successful created!`,
        URL: `/activities/${activity.id}`
      });
    }
    res.status(400).json({
      succes: false,
      message: 'Invalid credentials'
    })
    } catch (err) {
      if (err instanceof ValidationError)
        res.status(400).json({ success:false, msg: err.errors.map(e => e.message) });
      else
        res.status(500).json(
          {message: 'Something went wrong. Please try again later'}
        )
    }
};
exports.findAll = async (req, res) => {
  try {
    let activities = await Activity.findAll();
    if(activities === null){
      return res.status(404).json({
          success: false, msg: `Cannot find any activity.`
      });
  }
    res.status(200).json({
        success: true,
        activities: activities
    });
  } catch (err) {
    res.status(500).json({
        success: false, msg: err.message || "Some error as occurred"
    })
  }
}
exports.findOne = async (req, res) => {
  try{
    let activity = await Activity.findByPk(req.params.idA)
    if(activity === null)
      return res.status(404).json({
        success: false,
        msg: `activity id${req.params.idA} not founded.`,
      });
    res.status(200).json({
      success: true,
      message: activity
    });
  } catch (err) {
    if (err instanceof ValidationError) // Tutorial model as validations for title and published
        res.status(400).json({ success:false, msg: err.errors.map(e => e.message) });
      else
        res.status(500).json(
          {error: 'Something went wrong. Please try again later'}
        )
  }
}
exports.edit = async (req, res) => {
  try {
    if(req.loggedUser.role == 'admin'){
      let activity = await Activity.findByPk(req.params.idA)
      if(activity === null){
        return res.status(404).json({
          sucess: false,
          msg: `Activity not found.`
        })
      }
      if (req.body.name) activity.name = req.body.name;
      if (req.body.description) activity.description = req.body.description;
      if (req.body.start) activity.start = req.body.start;
      if (req.body.end) activity.end = req.body.end;
      if (req.body.location) activity.location = req.body.location;
      if (req.body.image) activity.image = req.body.image;
      Activity.update(
        {name: req.body.name,
        description: req.body.description,
        start: req.body.start,
        end: req.body.end,
        location: req.body.location,
        image: req.body.image},
        {
          where: {id: req.params.idA}
        }
        )
      return res.status(202).json({
        succes: true,
        msg: `Activity with ID ${activity.id} updated successfully`
      })
    }
    res.status(400).json({
      succes: false,
      message: 'Invalid credentials'
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
}
exports.delete = async (req, res) => {
  try {
    if(req.loggedUser.role == 'admin'){
      let result = await Activity.destroy({
          where: {id: req.params.idA}
      })
      if(result == 0) {
        return res.status(404).json({
            success: false,
            msg: `Activity with ID ${req.params.idA} Not Found`
        });
      }
      res.status(200).json({
          success: true,
          msg: `Deleted Activity with ID ${req.params.idA} successfully`
      });
    }
    res.status(400).json({
        success: false,
        msg: 'Invalid credentials'
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        msg: err.message || `Some error occurred while getting the activity with ID ${req.params.idA}.`
    });
}
}
