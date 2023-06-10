const { Op } = require('sequelize');
const db = require('../models/index');
const User = db.user;
const Event = db.event;
const Occurrence = db.occurrence;
const messages = require('../utilities/messages');

exports.findAll = async (req, res) => {
    try {
        let page = 0, limit = 5, createdAt = new Date();
        console.log(createdAt);
        if (req.query.page)
            page = +req.query.page;

        if (req.query.limit)
            limit = +req.query.limit;

        if (req.body.createdAt)
            createdAt = req.body.createdAt;

        if (typeof (page) != 'number') { res.status(400).json(messages.errorBadRequest(0, "page", "number")); return; };

        if (typeof (limit) != 'number') { res.status(400).json(messages.errorBadRequest(0, "limit", "number")); return; };

        if (!(createdAt instanceof Date)) { res.status(400).json(messages.errorBadRequest(0, "cretedAt", "instance of date")); return; };

        let events = await Event.findAll({
            where: {
                createdAt: {
                    [Op.lt]: createdAt
                }
            },
            order: [['createdAt', 'DESC']],
            offset: page, limit: limit,
            include: [{
                model: db.comment, offset: 0, limit: 2, order: [['createdAt', 'DESC']],
                include: {
                    model: User, attributes: ['username']
                }
            }],
        })

        let occurrences = await Occurrence.findAll({
            where: {
                createdAt: {
                    [Op.lt]: createdAt
                }
            },
            order: [['createdAt', 'DESC']],
            offset: page, limit: limit,
            include: [{
                model: db.comment, offset: 0, limit: 2, order: [['createdAt', 'DESC']],
                include: {
                    model: User, attributes: ['username']
                }
            }],
        })

        let eventsOccurrences = events.concat(occurrences);

        eventsOccurrences = eventsOccurrences.sort((a, b) => b.createdAt - a.createdAt)
        eventsOccurrences = eventsOccurrences.slice(0, limit)

        res.status(200).json(eventsOccurrences);

    } catch (err) {
        console.log(err);
        res.status(500).json(messages.errorInternalServerError());
    };
};
