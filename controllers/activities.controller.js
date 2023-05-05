const db = require("../models/index.js");
const Activity = db.activity;
const { ValidationError } = require('sequelize'); //necessary for model validations using sequelize

exports.create = async (req, res) => {
  const date = new Date();
  const todayDate = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2);
  try {
      //missing validate user that creates
      if(req.body.start <= todayDate || req.body.start >= req.body.end || req.body.end <= todayDate)
        return res.status(400).json({
          success: false,
          msg: 'Please provide a valid date'
        })
      let activity = await Activity.create(req.body)
      res.status(201).json({
        success: true,
        message: 'Account successful created!',
        URL: `/activities/${activity.id}`,
      });
    } catch (err) {
      if (err instanceof ValidationError) // Tutorial model as validations for title and published
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