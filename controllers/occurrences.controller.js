const db = require('../models/index');
const Occurrence = db.occurrence
const { validationImage } = require('../utilities/validation');
const messages = require('../utilities/messages');
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})

exports.findAll = async (req, res) => {
    try {
        let page = 0, limit = 5, occurrences;
        if (req.query.page)
            page = +req.query.page;

        if (req.query.limit)
            limit = +req.query.limit;

        if (typeof (page) !== 'number')
            res.status(400).json(messages.errorBadRequest(0, "Page", "number"));

        if (typeof (limit) !== 'number')
            res.status(400).json(messages.errorBadRequest(0, "Limit", "number"));

        if(req.loggedUser && req.loggedUser.role === 'admin') 
            occurrences = await Occurrence.findAll({ order: [['createdAt', 'DESC']], offset: page, limit: limit, include: { model: db.comment, offset: 0, limit: 2, order: [['createdAt', 'DESC']] } });
        else 
            occurrences = await Occurrence.findAll({where: { status: [1, 2] }, order: [['createdAt', 'DESC']], offset: page, limit: limit, include: { model: db.comment, offset: 0, limit: 2, order: [['createdAt', 'DESC']] } });

            occurrences.forEach(occurrence => {
                occurrence.image = occurrence.image.toString('base64');
            })

            res.status(200).json(occurrences);

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.create = async (req, res, next) => {
    try {
        let occurrence = {};
        switch ("validationBodyData") {

            case "validationBodyData":

                // Validation if body have everything required
                if (!req.body.name) { res.status(400).json(messages.errorBadRequest(1, "name")); break; };
                if (!req.body.description) { res.status(400).json(messages.errorBadRequest(1, "description")); break; };
                if (!req.body.location) { res.status(400).json(messages.errorBadRequest(1, "location")); break; };
                if (!req.files.image) { res.status(400).json(messages.errorBadRequest(1, "image")); break; };


                // Validation if body values are passed parameters with the correct type
                if (typeof (req.body.name) != "string") { res.status(400).json(messages.errorBadRequest(0, "Name", "string")); break; }
                else occurrence.name = req.body.name;

                if (typeof (req.body.description) != "string") { res.status(400).json(messages.errorBadRequest(0, "Description", "string")); break; }
                else occurrence.description = req.body.description;

                if (typeof (req.body.location) != "string") { res.status(400).json(messages.errorBadRequest(0, "Location", "string")); break; }
                else occurrence.location = req.body.location;

                if(req.body.locationDescription && typeof (req.body.locationDescription) != "string") { res.status(400).json(messages.errorBadRequest(0, "Location Description", "string")); break; }
                else occurrence.locationDescription = req.body.locationDescription;

                if (typeof (req.files.image) != "object") { res.status(415).json(messages.errorBadRequest(0, "Image", "image")); break; }
                else occurrence.image = req.files.image.data;

                const imgData = req.files.image.data;
                occurrence.image = imgData

                occurrence.userId = req.loggedUser.id;

            case "create":
                let newOccurrence = await Occurrence.create(occurrence);
                res.status(201).json(messages.successCreated("Occurrence", newOccurrence.id));
                next();
        };

    } catch (err) {
        console.log(err)
        // res.status(500).json(messages.errorInternalServerError());
    };
};

exports.findByID = async (req, res) => {
    try {
        let occurrence = await Occurrence.findByPk(req.params.occurrenceId, {include: [{model: db.comment}, {model: db.user, attributes: ['id','username','role']}]});
        if (!occurrence) {
            res.status(404).json({ error: `${req.params.occurrenceId} not founded` });
        } else {
            occurrence.image = occurrence.image.toString('base64');
            res.status(200).json(occurrence);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.edit = async (req, res, next) => {
    try {
        let occurrence = await Occurrence.findByPk(req.params.occurrenceId);

        if (occurrence.userId != req.loggedUser.id) res.status(403).json(messages.errorForbidden());

        else {
            switch ("validationBodyData") {

                case "validationBodyData":

                    if (req.body.name && typeof (req.body.name) != "string") { res.status(400).json(messages.errorBadRequest(0, "Name", "string")); break; }
                    else occurrence.name = req.body.name;

                    if (req.body.description && typeof (req.body.description) != "string") { res.status(400).json(messages.errorBadRequest(0, "Description", "string")); break; }
                    else occurrence.description = req.body.description;

                    if (req.body.location && typeof (req.body.location) != "string") { res.status(400).json(messages.errorBadRequest(0, "Location", "string")); break; }
                    else occurrence.location = req.body.location;

                    if (req.files.image && typeof (req.files.image) != "object") { res.status(400).json(messages.errorBadRequest(0, "Image", "image")); break; }
                    else occurrence.image = req.files.image.data;

                case "update":
                    await Occurrence.update({ name: occurrence.name, description: occurrence.description, location: occurrence.location, image: occurrence.image, status: 0 }, { where: { id: occurrence.id } });
                    res.status(200).json({ msg: `Occurrence ${occurrence.id} was successfully changed!` });
                    next();
            };
        };
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.editStatus = async (req, res, next) => {
    try {

        if (req.loggedUser.role == "admin") {
            switch ("validationBodyData") {
                case "validationBodyData":
                    console.log(req.body.status)
                    if (!req.body.status && req.body.status != 0) { res.status(400).json(messages.errorBadRequest(1, "Status")); break; };

                    if (![0, 1, 2].includes(req.body.status)) { res.status(400).json(messages.errorBadRequest(0, "Status", "integer number between 0 and 2")); break; };

                case "update":
                    await Occurrence.update({ status: req.body.status }, { where: { id: req.params.occurrenceId } });
                    res.status(200).json({ msg: `Occurrence ${req.params.occurrenceId} status was successfully changed!` });
                    next()
            };

        } else {
            res.status(403).json(messages.errorForbidden());
        };

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.delete = async (req, res, next) => {
    try {
        const occurrence = await Occurrence.findOne({where: {id: req.params.occurrenceId}})

        if(occurrence){
            if (req.loggedUser.id == occurrence.userId || req.loggedUser.role == "admin") {
                await Occurrence.destroy({ where: { id: req.params.occurrenceId } });
                res.status(200).json({ msg: `Occcurrence ${req.params.occurrenceId} was successfully deleted!` });
                next();
            } else {
                res.status(403).json(messages.errorForbidden());
            }
        } else res.status(404).json(messages.errorNotFound());
        
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};