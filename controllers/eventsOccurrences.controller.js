const { Op } = require('sequelize');
const db = require('../models/index');
const User = db.user;
const Event = db.event;
const Occurrence = db.occurrence;
const messages = require('../utilities/messages');

exports.findAll = async (req, res) => {
    try {
        let page = 0, limit = 5, createdAt = new Date();
        if (req.query.page)
        page = +req.query.page;
        
        if (req.query.limit)
        limit = +req.query.limit;
        
        if (req.query.createdAt)
        createdAt = req.query.createdAt;
        console.log(createdAt)
        console.log(createdAt, limit, page, "oi");
        if (typeof (page) != 'number') { res.status(400).json(messages.errorBadRequest(0, "page", "number")); return; };

        if (typeof (limit) != 'number') { res.status(400).json(messages.errorBadRequest(0, "limit", "number")); return; };

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
                status: 1,
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

        eventsOccurrences.forEach(eventOccurrence => {
            if (eventOccurrence.image)
                eventOccurrence.image = eventOccurrence.image.toString('base64')
            if(eventOccurrence.files)
                eventOccurrence.files = eventOccurrence.files.toString('base64')
        })

        res.status(200).json(eventsOccurrences);

    } catch (err) {
        console.log(err);
        res.status(500).json(messages.errorInternalServerError());
    };
};
