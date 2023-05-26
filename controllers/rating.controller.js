const db = require("../models/index");
const Rating = db.rating;
const messages = require("../utilities/messages");
const validation = require("../utilities/validation.js");

exports.getAll = async (req, res) => {
  try {
    await db.sequelize.query(
      `SELECT COUNT(CASE WHEN rating = true THEN 1 END) - COUNT(CASE WHEN rating = false THEN 1 END) AS result FROM ratings WHERE commentId = ${req.params.commentId}`
    ).then(result => {
      res.json(result[0][0])
    })
  } catch (err) {
    console.log(err)
    res.status(500).json(messages.errorInternalServerError());
  };
};

exports.like = async (req, res) => {
  try {
    let rating = await Rating.findOne({
      where: { commentId: req.params.commentId, userId: req.loggedUser.id },
    });
    if (!rating) {
      rating = {};
      rating.commentId = req.params.commentId;
      rating.userId = req.loggedUser.id;
      rating.like = req.body.rating;
      await Rating.create(rating);
      res.status(200).send({ msg: `Like Created`, rating: rating.like });
    } else {
      await rating.update({ like: req.body.rating });
      res.status(200).send({ msg: `Like Updated`, rating: rating.like });
    }
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError());
  }
};

exports.delete = async (req, res) => {
  try {
    let rating = await Rating.findOne({
      where: { commentId: req.params.commentId, userId: req.loggedUser.id },
    });
    await rating.delete({ where: { commentId: req.params.commentId, userId: req.loggedUser.id } })
    res.status(200).send({ msg: `Like Deleted`, rating: null });
  } catch (err) {
    res.status(500).json(messages.errorInternalServerError());
  }
};