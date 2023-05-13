const db = require('../models/index');
const Event = db.event;
const { validationImage, validationDate, validationFiles } = require('../utilities/validation');
const messages = require('../utilities/messages');

exports.findAll = async (req, res) => {
    try {
        let page = 0, limit = 5;
        if (req.body.page)
            page = req.body.page;

        if (req.body.limit)
            limit = req.body.limit;

        if (typeof (page) !== 'number')
            res.status(400).json(messages.errorBadRequest(0, "Page", "number"));

        if (typeof (limit) !== 'number')
            res.status(400).json(messages.errorBadRequest(0, "Limit", "number"));

        let event = await Event.findAll({ offset: limit * page, limit: limit });

        res.status(200).json(event);

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.create = async (req, res) => {
    try {
        let event = {};
        switch ("validationBodyData") {
            case "validationBodyData":

                // Validation if body have everything required
                if (!req.body.name) { res.status(401).json(messages.errorBadRequest(1, "name")); break; };
                if (!req.body.description) { res.status(401).json(messages.errorBadRequest(1, "description")); break; };
                if (!req.body.location) { res.status(401).json(messages.errorBadRequest(1, "location")); break; };
                if (!req.body.start) { res.status(401).json(messages.errorBadRequest(1, "start")); break; };
                if (!req.body.end) { res.status(401).json(messages.errorBadRequest(1, "end")); break; };


                // Validation if body values are passed parameters with the correct type
                if (typeof req.body.name !== "string") { res.status(401).json(messages.errorBadRequest(0, "Name", "string")); break; }
                else event.name = req.body.name;

                if (typeof req.body.description !== "string") { res.status(401).json(messages.errorBadRequest(0, "Description", "string")); break; }
                else event.description = req.body.description;

                if (typeof req.body.location !== "string") { res.status(401).json(messages.errorBadRequest(0, "Location", "string")); break; }
                else event.location = req.body.location;

                if (typeof req.body.subtitle !== "string") { res.status(401).json(messages.errorBadRequest(0, "Subtitle", "string")); break; }
                else event.subtitle = req.body.subtitle;

                if (!validationDate(req.body.start)) { res.status(401).json(messages.errorBadRequest(0, "Start", "instance of Date")); break; }
                else event.start = req.body.start;

                if (!validationDate(req.body.end)) { res.status(401).json(messages.errorBadRequest(0, "End", "instance of Date")); break; }
                else event.end = req.body.end;

                if (req.body.files && !validationFiles(req.body.files)) { res.status(401).json(messages.errorBadRequest(0, "Files", "instance of File")); break; }
                else event.files = req.body.files;

                if (req.body.image && !validationImage(req.body.image)) { res.status(415).json(messages.errorBadRequest(0, "Image", "image")); break; }
                else event.image = req.body.image;

                event.IdCreatorId = req.loggedUser.id;

            case "create":
                let newEvent = await Event.create(event);
                res.status(201).json(messages.successCreated("Event", newEvent.id));
        };
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.findByID = async (req, res) => {
    try {
        let event = await Event.findByPk(req.params.id);
        if (!event) {
            res.status(404).json({ error: `${req.params.id} not founded` });
        } else res.status(200).json(event);
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.edit = async (req, res) => {
    try {
        let event = await Event.findByPk(req.params.id);

        if (event.IdCreatorId != req.loggedUser.id || req.loggedUser.role == "admin") res.status(403).json(messages.errorForbidden());

        else {
            switch ("validationBodyData") {

                case "validationBodyData":

                    if (req.body.name && typeof req.body.name !== "string") { res.status(401).json(messages.errorBadRequest(0, "Name", "string")); break; }
                    else event.name = req.body.name;

                    if (req.body.description && typeof req.body.description !== "string") { res.status(401).json(messages.errorBadRequest(0, "Description", "string")); break; }
                    else event.description = req.body.description;

                    if (req.body.location && typeof req.body.location !== "string") { res.status(401).json(messages.errorBadRequest(0, "Location", "string")); break; }
                    else event.location = req.body.location;

                    if (req.body.subtitle && typeof req.body.subtitle !== "string") { res.status(401).json(messages.errorBadRequest(0, "Subtitle", "string")); break; }
                    else event.subtitle = req.body.subtitle;

                    if (req.body.start && !validationDate(req.body.start)) { res.status(401).json(messages.errorBadRequest(0, "Start", "instance of Date")); break; }
                    else event.start = req.body.start;

                    if (req.body.end && !validationDate(req.body.end)) { res.status(401).json(messages.errorBadRequest(0, "End", "instance of Date")); break; }
                    else event.end = req.body.end;

                    if (req.body.files && !validationFiles(req.body.files)) { res.status(401).json(messages.errorBadRequest(0, "Files", "instance of File")); break; }
                    else event.files = req.body.files;

                    if (req.body.image && !validationImage(req.body.image)) { res.status(415).json(messages.errorBadRequest(0, "Image", "image")); break; }
                    else event.image = req.body.image;

                case "update":
                    await Event.update({ name: event.name, description: event.description, location: event.location, subtitle: event.subtitle, start: event.start, end: event.end, files: event.files, image: event.image }, { where: { id: event.id } });
                    res.status(200).json({ msg: `Event ${event.id} was successfully changed!` });
            };
        };
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.delete = async (req, res) => {
    try {
        if (req.loggedUser.id || req.loggedUser.role == "admin") {
            await Event.destroy({ where: { id: req.params.id } });
            res.status(200).json({ msg: `Event ${req.params.id} was successfully deleted!` });
        } else {
            res.status(403).json(messages.errorForbidden());
        }
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};