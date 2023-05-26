const db = require("../models/index");
const Rating = db.rating;
const messages = require("../utilities/messages");
const validation = require("../utilities/validation.js");

exports.getAll = async (req, res) => {
  let rating = await Rating.findAll();
  
  res.status(200).json(rating);
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
        await rating.delete( {where: { commentId: req.params.commentId, userId: req.loggedUser.id}} )    
        res.status(200).send({ msg: `Like Deleted`, rating: null });
} catch (err) {
    res.status(500).json(messages.errorInternalServerError());
  }
};