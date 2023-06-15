const db = require("../models/index.js");
const Activity = db.activity;
const User = db.user;
const { ValidationError } = require('sequelize'); //necessary for model validations using sequelize
const {validationDates} = require('../utilities/validation');
const messages = require('../utilities/messages');

exports.create = async (req, res, next) => {
  try {
    if(req.loggedUser.role == 'admin') {
      if(!validationDates(req.body.start, req.body.end)) return res.status(400).json(messages.errorBadRequest(1,'date interval', 'valid one'));
      req.body.IdCreator = req.loggedUser.id;
      req.body.image = req.files.image.data
      let activity = await Activity.create(req.body);
      res.status(201).json(messages.successCreated('Activity', activity.id));
      next();
    } else res.status(403).json(messages.errorBadRequest(1, 'token', 'valid credential'));
  } catch (err) {
    if (err instanceof ValidationError)
      res.status(400).json(messages.errorBadRequest(2));
    else
      res.status(500).json(messages.errorInternalServerError());
  }
};
exports.findAll = async (req, res) => {
  try {
    let page = 0, limit = 5;
    if (req.query.page)
        page = +req.query.page;

    if (req.query.limit)
        limit = +req.query.limit;

    if (typeof (page) != 'number') { res.status(400).json(messages.errorBadRequest(0, "Page", "number")); return; };

    if (typeof (limit) != 'number') { res.status(400).json(messages.errorBadRequest(0, "Limit", "number")); return; };

    let activities = await Activity.findAll({ offset: page, limit: limit, include: [{ model: db.comment, offset: 0, limit: 2, order: [['createdAt', 'DESC']], include: { model: User, attributes: ['username'] } }] });


    activities.forEach(activity => {
      if (activity.image) activity.image = activity.image.toString('base64');
    })


    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError())
  }
}
exports.findOne = async (req, res) => {
  try{
    let activity = await Activity.findByPk(req.params.activityId, { include: { model: User, attributes: ["username", "image", "role"], through: { attributes: [] } } })
    if(activity === null) return res.status(404).json(messages.errorNotFound(`Activity ${req.params.activityId}`));
    
    if (activity.image) activity.image = activity.image.toString('base64');

    res.status(200).json(activity);
  } catch (err) {
    if (err instanceof ValidationError) // Tutorial model as validations for title and published
        res.status(400).json(messages.errorBadRequest(2));
      else
        res.status(500).json(messages.errorInternalServerError())
  }
}
exports.edit = async (req, res, next) => {
  try {
    if(req.loggedUser.role == 'admin'){
      let activity = await Activity.findByPk(req.params.activityId)
      if(activity === null){
        return res.status(404).json(messages.errorNotFound('Activity'));
      }
      if (req.body.name && typeof req.body.name !== "string") res.status(400).json(messages.errorBadRequest(0, "Name", "string")) 
      else activity.name = req.body.name;
      if (req.body.description && typeof req.body.description != "string") res.status(400).json(messages.errorBadRequest(0, "Description", "string"))
      else activity.description = req.body.description;
      if (req.body.start && typeof req.body.start != "string") res.status(400).json(messages.errorBadRequest(0, "Start", "date"))
      else activity.start = req.body.start;
      if (req.body.end && typeof req.body.end != "string") res.status(400).json(messages.errorBadRequest(0, "End", "date"))
      else activity.end = req.body.end;
      if (req.body.location &&  typeof req.body.location != "string") res.status(400).json(messages.errorBadRequest(0, "Location", "string"))
      else activity.location = req.body.location;
      if (req.files.image && typeof req.files.image != "object") res.status(400).json(messages.errorBadRequest(0, "Image", "object"))
      else activity.image = req.files.image.data;
      // FECHAR POR CAUSA DOS LOGS
      Activity.update(
        {name: req.body.name,
        description: req.body.description,
        start: req.body.start,
        end: req.body.end,
        location: req.body.location,
        image: req.files.image.data},
        {
          where: {id: req.params.activityId}
        }
        )
      res.status(202).json(messages.successAccepted);
      next()
    }
    res.status(403).json(messages.errorBadRequest(1, 'token', 'valid credential'));
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError);
  }
}
exports.delete = async (req, res, next) => {
  try {
    
    const activity = await Activity.findOne({where: {id: req.params.activityId}})

    if(activity){
      if(req.loggedUser.role == 'admin'){
        let result = await Activity.destroy({
            where: {id: req.params.activityId}
        })
        if(result == 0) {
          return res.status(404).json(messages.errorNotFound('Activity'));
        }
        res.status(200).json({
            success: true,
            msg: `Deleted Activity ${req.params.activityId} successfully`
        });
        next()
      } else res.status(403).json(messages.errorBadRequest(1, 'token', 'valid credential'))
    } else res.status(400).json(messages.errorNotFound('Activity'));

  } catch (err) {
    res.status(500).json(messages.errorInternalServerError);
  }
}

exports.subscribe = async (req, res, next) => {
  try {
    let activity = await Activity.findByPk(req.params.activityId)
    if (!activity) { res.status(404).json(messages.errorNotFound(`Activity ${req.params.activityId}`)); return };
    let user = await User.findByPk(req.loggedUser.id)
    await activity.addUser(user);
    res.status(200).json("Subscribed");
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError());
  }
}

exports.unsubscribe = async (req, res) => {
  try {
    let activity = await Activity.findByPk(req.params.activityId)
    if (!activity) { res.status(404).json(messages.errorNotFound(`Activity ${req.params.activityId}`)); return };
    let user = await User.findByPk(req.loggedUser.id)
    await activity.removeUser(user);
    res.status(200).json("Unsubscribed");
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError());
  }
}

exports.getAllSubscribed = async (req, res) => {
  try {
    let activity = await Activity.findByPk(req.params.activityId)
    if (!activity) { res.status(404).json(messages.errorNotFound(`Activity ${req.params.activityId}`)); return };
    // console.log(await activity.getUsers());
    console.log(await activity.getUser());
    console.log("bom dia")
    const activityUser = await Activity.findAll({where: {id: req.params.activityId}, include: {model: User, attributes: ['id','username', 'image', 'role']}, attributes: ['id'] })
    res.status(200).json(activityUser)
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError())
  }
}
