const db = require('../models/index');
const Occurrence = db.occurrence
const { validationImage } = require('../utilities/validation');
const messages = require('../utilities/messages');

exports.findAll = async (req, res) => {
    try {
        let page = 0, limit = 5;
        if (req.body.page)
            page = req.body.page;

        if (req.body.limit)
            limit = req.body.limit;

        if (typeof (page) !== 'number')
            res.status(400).json({ error: "Page must be a number" });

        if (typeof (limit) !== 'number')
            res.status(400).json({ error: "Limit must be a number" });

        let occurrences = await Occurrence.findAll({ offset: limit * page, limit: limit });

        res.status(200).json(occurrences);

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.create = async (req, res) => {
    try {
        console.log(req.loggedUser.id);
        let occurrence = {};
        switch ("validationBodyData") {

            case "validationBodyData":

                // Validation if body have everything required
                if (!req.body.name) { res.status(401).json(messages.errorBadRequest(1, "name")); break; };
                if (!req.body.description) { res.status(401).json(messages.errorBadRequest(1, "description")); break; };
                if (!req.body.location) { res.status(401).json(messages.errorBadRequest(1, "location")); break; };
                if (!req.body.image) { res.status(401).json(messages.errorBadRequest(1, "image")); break; };


                // Validation if body values are passed parameters with the correct type
                if (typeof (req.body.name) != "string") { res.status(401).json(messages.errorBadRequest(0, "Name", "string")); break; }
                else occurrence.name = req.body.name;

                if (typeof (req.body.description) != "string") { res.status(401).json(messages.errorBadRequest(0, "Description", "string")); break; }
                else occurrence.description = req.body.description;

                if (typeof (req.body.location) != "string") { res.status(401).json(messages.errorBadRequest(0, "Location", "string")); break; }
                else occurrence.location = req.body.location;

                if (validationImage(req.body.image)) { res.status(401).json(messages.errorBadRequest(0, "Image", "image")); break; }
                else occurrence.image = req.body.image;


                occurrence.userId = req.loggedUser.id;

            case "update":
                let newOccurrence = await Occurrence.create(occurrence);
                res.status(201).json(messages.successCreated("Occurrence", newOccurrence.id));
        };

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.findByID = async (req, res) => {
    try {
        let occurrence = await Occurrence.findByPk(req.params.id)
        if (!occurrence) {
            res.status(404).json({ error: `${req.params.id} not founded` });
        } else res.status(200).json(occurrence);
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.edit = async (req, res) => {
    try {
        let occurrence = await Occurrence.findByPk(req.params.id);

        if (occurrence.userId != req.loggedUser.id) res.status(403).json(messages.errorForbidden());

        else {
            switch ("validationBodyData") {

                case "validationBodyData":

                    if (req.body.name && typeof (req.body.name) != "string") { res.status(401).json(messages.errorBadRequest(0, "Name", "string")); break; }
                    else occurrence.name = req.body.name;

                    if (req.body.description && typeof (req.body.description) != "string") { res.status(401).json(messages.errorBadRequest(0, "Description", "string")); break; }
                    else occurrence.description = req.body.description;

                    if (req.body.location && typeof (req.body.location) != "string") { res.status(401).json(messages.errorBadRequest(0, "Location", "string")); break; }
                    else occurrence.location = req.body.location;

                    if (req.body.image && validationImage(req.body.image)) { res.status(401).json(messages.errorBadRequest(0, "Image", "image")); break; }
                    else occurrence.image = req.body.image;

                case "update":
                    await Occurrence.update({ name: occurrence.name, description: occurrence.description, location: occurrence.location, image: occurrence.image, status: 0 }, { where: { id: occurrence.id } });
                    res.status(200).json({ msg: `Occurrence ${occurrence.id} was successfully changed!` });
            };
        };
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.editStatus = async (req, res) => {
    try {

        if (req.loggedUser.role == "admin") {
            switch ("validationBodyData") {
                case "validationBodyData":
                    if (!req.body.status) { res.status(401).json(messages.errorBadRequest(1, "Status")); break; };

                    if (![0, 1, 2].includes(req.body.status)) { res.status(401).json(messages.errorBadRequest(0, "Status", "integer number between 0 and 2")); break; };

                case "update":
                    await Occurrence.update({ status: req.body.status }, { where: { id: req.params.id } });
                    res.status(200).json({ msg: `Occurrence ${req.params.id} status was successfully changed!` });
            };

        } else {
            res.status(403).json(messages.errorForbidden());
        };

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.delete = async (req, res) => {
    try {
        if (req.loggedUser.id || req.loggedUser.role == "admin") {
            await Occurrence.destroy({ where: { id: req.params.id } });
            res.status(200).json({ msg: `Occcurrence ${req.params.id} was successfully deleted!` });
        } else {
            res.status(403).json(messages.errorForbidden());
        }
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};