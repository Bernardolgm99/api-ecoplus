const db = require("../models/index.js");
const Activity = db.activity;
const User = db.user;
const { ValidationError } = require('sequelize'); //necessary for model validations using sequelize
const {validationDates} = require('../utilities/validation');
const messages = require('../utilities/messages');

exports.create = async (req, res) => {
  try {
    if(req.loggedUser.role == 'admin') {
      if(!validationDates(req.body.start, req.body.end)) return res.status(400).json(messages.errorBadRequest(1,'date interval', 'valid one'));
      req.body.IdCreator = req.loggedUser.id;
      let activity = await Activity.create(req.body);
      return res.status(201).json(messages.successCreated('Activity', activity.id));
    }
    res.status(400).json(messages.errorBadRequest(1, 'token', 'valid credential'));
  } catch (err) {
    if (err instanceof ValidationError)
      res.status(400).json(messages.errorBadRequest(2));
    else
      res.status(500).json(messages.errorInternalServerError());
  }
};
exports.findAll = async (req, res) => {
  try {
    let activities = await Activity.findAll();
    if(activities === null){
      return res.status(404).json(messages.errorNotFound('Activity'));
  }
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError())
  }
}
exports.findOne = async (req, res) => {
  try{
    let activity = await Activity.findByPk(req.params.idA)
    if(activity === null)
      return res.status(404).json(messages.errorNotFound(`Activity ${req.params.idA}`));
    res.status(200).json(activity);
  } catch (err) {
    if (err instanceof ValidationError) // Tutorial model as validations for title and published
        res.status(400).json(messages.errorBadRequest(2));
      else
        res.status(500).json(messages.errorInternalServerError())
  }
}
exports.edit = async (req, res) => {
  try {
    if(req.loggedUser.role == 'admin'){
      let activity = await Activity.findByPk(req.params.idA)
      if(activity === null){
        return res.status(404).json(messages.errorNotFound('Activity'));
      }
      if (!req.body.name) res.status(400).json(messages.errorBadRequest(0, "Name", "string")) 
      else activity.name = req.body.name;
      if (!req.body.description) res.status(400).json(messages.errorBadRequest(0, "Description", "string"))
      else activity.description = req.body.description;
      if (!req.body.start) res.status(400).json(messages.errorBadRequest(0, "Start", "date"))
      else activity.start = req.body.start;
      if (!req.body.end) res.status(400).json(messages.errorBadRequest(0, "End", "date"))
      else activity.end = req.body.end;
      if (!req.body.location) res.status(400).json(messages.errorBadRequest(0, "Location", "string"))
      else activity.location = req.body.location;
      if (!req.body.image) res.status(400).json(messages.errorBadRequest(0, "Image", "object"))
      else activity.image = req.body.image;
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
      return res.status(202).json(messages.successAccepted);
    }
    res.status(400).json(messages.errorBadRequest(1, 'token', 'valid credential'));
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError);
  }
}
exports.delete = async (req, res) => {
  try {
    if(req.loggedUser.role == 'admin'){
      let result = await Activity.destroy({
          where: {id: req.params.idA}
      })
      if(result == 0) {
        return res.status(404).json(messages.errorNotFound('Activity'));
      }
      res.status(200).json({
          success: true,
          msg: `Deleted Activity ${req.params.idA} successfully`
      });
    }
    res.status(400).json(messages.errorNotFound('Activity'));
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError);
}
}
exports.subscribe = async (req, res) => {
  let arrayUsers;
  try {
    let activity = await Activity.findByPk(req.params.idA)
    if(activity === null) return res.status(404).json(messages.errorNotFound(`Activity ${req.params.idA}`));
    let user = await User.findByPk(req.params.idU)
    if(user === null) return res.status(404).json(messages.errorNotFound(`User ${req.params.idU}`));
    let result = await activity.addUser(user);
    console.log(result)
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError)
  }

}
exports.unsubscribe = async (req, res) => {
}
exports.getAllsubscribed = async (req, res) => {
  try {
    let activity = await Activity.findByPk(req.params.idA)
    if(activity === null) return res.status(404).json(messages.errorNotFound(`Activity ${req.params.idA}`));
    res.status(200).json(activity.getUsers());
  } catch (err){
    console.log(err)
    res.status(500).json(messages.errorInternalServerError)
  }
}
