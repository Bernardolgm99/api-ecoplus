const db = require('../models/index');
const Comment = db.comment
const Rating = db.rating
const messages = require('../utilities/messages');
const validation = require('../utilities/validation.js');

exports.create = async (req, res, next) => {
    try {

        let comment = {}
        comment.description = req.body.description

        if (req.params.eventId != null) {
            comment.eventId = req.params.eventId
        } else if (req.params.activityId != null) {
            comment.activityId = req.params.activityId
        } else {
            comment.occurrenceId = req.params.occurrenceId
        } 

        comment.userId = req.loggedUser.id


        let newComment = await Comment.create(comment)
        res.status(201).json({
            sucess: true,
            msg: `Comment created successfully`,
            URL: `/comments/${newComment.id}`
        })
        next();
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.edit = async (req, res) => {
    try {
        let comment = await Comment.findByPk(req.params.commentId)
       
        if (req.loggedUser.id == comment.userId) {

            if (req.body.description != comment.description) {
                comment.description = req.body.description
                comment.edited = true

                res.status(200).json({
                    sucess: true,
                    msg: `Comment updated successfully`
                })
            }
        }


    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.findAll = async (req, res) => {
    try {
        // Pagination
        let page = 0, limit = 5;
        if (req.query.page)
            page = +req.query.page;

        if (req.query.limit)
            limit = +req.query.limit;

        // Verify data
        if (typeof (page) != 'number') { res.status(400).json(messages.errorBadRequest(0, "Page", "number")); return; };

        if (typeof (limit) != 'number') { res.status(400).json(messages.errorBadRequest(0, "Limit", "number")); return; };

        if (req.originalUrl.split('/')[1] == 'events') {
            let comments = await Comment.findAll({ order: [['createdAt', 'DESC']], offset: page, limit: limit, where: { eventId: req.params.eventId }, include: [{ model: db.user, attributes: ['username'] }, { model: db.rating }] }).then(
                (comments) => {
                    let count = 0;

                    let newComments = JSON.parse(JSON.stringify(comments, null, 4))

                    newComments.forEach(comment => {
                        count = 0;
                        comment.ratings.forEach(rating => {
                           
                            if (rating.rating)
                                count++;
                            else
                                count--;
                        });
                        comment.ratings = count;

                    });

                    return newComments
                });

            res.status(200).json(comments)
        } else if (req.originalUrl.split('/')[1] == 'activities') {
            let comments = await Comment.findAll({ order: [['createdAt', 'DESC']], offset: page, limit: limit, where: { activityId: req.params.activityId }, include: [{ model: db.user, attributes: ['username'] }, { model: db.rating }] }).then(
                (comments) => {
                    let count = 0;

                    let newComments = JSON.parse(JSON.stringify(comments, null, 4))

                    newComments.forEach(comment => {
                        count = 0;
                        comment.ratings.forEach(rating => {
                          
                            if (rating.rating)
                                count++;
                            else
                                count--;
                        });
                        comment.ratings = count;

                    });

                    return newComments
                });

            res.status(200).json(comments)
        } else {
            let comments = await Comment.findAll({ order: [['createdAt', 'DESC']], offset: page, limit: limit, where: { occurrenceId: req.params.occurrenceId }, include: [{ model: db.user, attributes: ['username'] }, { model: db.rating }] }).then(
                (comments) => {
                    let count = 0;

                    let newComments = JSON.parse(JSON.stringify(comments, null, 4))

                    newComments.forEach(comment => {
                        count = 0;
                        comment.ratings.forEach(rating => {

                            if (rating.rating)
                                count++;
                            else
                                count--;
                        });
                        comment.ratings = count;

                    });

                    return newComments
                });

            res.status(200).json(comments)
        }

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.findOne = async (req, res) => {
    try {
        let comment = await Comment.findByPk(req.params.commentId)
        if (comment != undefined) {
            res.status(200).json(comment)
        } else {
            res.status(400).json({ succes: false, message: 'Invalid comment.' })
        }

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}

exports.delete = async (req, res) => {
    try {
        let comment = await Comment.findByPk(req.params.commentId)
        const c = await Comment.findAll({ where: {occurrenceId: 11}})
        if (req.loggedUser.id == comment.userId || req.loggedUser.role == 'admin') {
            await Comment.destroy({ where: { id: req.params.commentId } })
            res.status(200).json({
                sucess: true,
                msg: `Comment deleted successfully`,
            })
        } else {
            res.status(403).json(messages.errorForbidden())
        }
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    }
}
