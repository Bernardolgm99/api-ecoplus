const db = require('../models/index');
const Comment = db.comment
const messages = require('../utilities/messages');

exports.create = async (req, res) => {
    try {
        let comment = {}
        comment.description = req.body.description
        
        if(req.params.id != null) {
            comment.eventId = req.params.id
        } else {
            comment.activityId = req.params.idA
        }
        

        let newComment = await Comment.create(comment)
        res.status(200).json({
            sucess: true,
            msg: `Comment created successfully`,
            URL: `/comments/${newComment.id}`
          })
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.edit = async (req, res) => {
    try {

        let comment = await Comment.findByPk(req.params.commentId)

        if(req.body.description != comment.description) {
            comment.description = req.body.description
            comment.edited = true
            
            res.status(200).json({
                sucess: true,
                msg: `Comment updated successfully`
              })
        }

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.findAll = async (req, res) => {
    try {
        let comments

        if(req.params.id != null ){
            comments = await Comment.findAll({where: {eventId: req.params.id}})
            res.status(200).json(comments)
        } else {
            comments = await Comment.findAll({where: {eventId: req.params.idA}})
            res.status(200).json(comments)
        }

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.findOne = async (req, res) => {
    try {
        let comment
        
        if(req.params.id != null ){
            comment = await Comment.findAll(req.params.commentId)

            if(comment != undefined){
                res.status(200).json(comment)
            } else {
                res.status(400).json({succes: false, message: 'Invalid comment.'})
            }

        } else {
            comment = await Comment.findAll(req.params.commentId)

            if(comment != undefined){
                res.status(200).json(comment)
            } else {
                res.status(400).json({succes: false, message: 'Invalid comment.'})
            }
        } 

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.delete = async (req, res) => {
    try {
        let comment = await Comment.destroy({where: {id: req.params.commentId}})
        res.status(200).json({
            sucess: true,
            msg: `Comment deleted successfully`,
          })
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.rating = async (req, res) => {
    try {
        let comment = await Comment.findByPk(req.params.commentId)

        if(req.body.rating == "like") {
            comment.like += 1;
        } else if (req.body.rating == "dislike"){
            comment.dislike += 1;
        }

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}