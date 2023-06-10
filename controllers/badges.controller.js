const db = require('../models/index');
const Badge = db.badge
const User = db.user
const messages = require('../utilities/messages');

exports.findAll = async (req, res) => {
    try {
        let badge = await Badge.findAll();
        if(badge) {
            res.status(200).json(badge);
        } else res.status(404).json(messages.errorNotFound('Badges'));

    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.findByID = async (req, res) => {
    try {
        let badge = await Badge.findByPk(req.params.id);
        if (!badge) {
            res.status(404).json({ error: `${req.params.id} not founded` });
        } else res.status(200).json(badge);
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};


exports.create = async (req, res) => {
    try {
        let badge = {};
        switch ("validationBodyData") {
            case "validationBodyData":

                // Validation if user is a admin to do this action
                if (req.loggedUser.role !== "admin") { res.status(403).json(messages.errorForbidden()); break; };

                // Validation if body have everything required
                if (!req.body.name) { res.status(400).json(messages.errorBadRequest(1, "name")); break; };
                if (!req.body.description) { res.status(400).json(messages.errorBadRequest(1, "description")); break; };
                if (!req.body.conditionType) { res.status(400).json(messages.errorBadRequest(1, "conditionType")); break; };
                if (!req.body.value) { res.status(400).json(messages.errorBadRequest(1, "value")); break; };
                if (!req.body.logo) { res.status(400).json(messages.errorBadRequest(1, "logo")); break; };


                // Validation if body values are passed parameters with the correct type
                if (typeof req.body.name !== "string") { res.status(400).json(messages.errorBadRequest(0, "name", "string")); break; }
                else badge.name = req.body.name;

                if (typeof req.body.description !== "string") { res.status(400).json(messages.errorBadRequest(0, "description", "string")); break; }
                else badge.description = req.body.description;

                if (typeof req.body.conditionType !== "string") { res.status(400).json(messages.errorBadRequest(0, "conditionType", "string")); break; }
                else badge.conditionType = req.body.conditionType;

                if (typeof req.body.value !== "number") { res.status(400).json(messages.errorBadRequest(0, "value", "number")); break; }
                else badge.value = req.body.value;

                if (typeof req.body.logo !== "object") { res.status(400).json(messages.errorBadRequest(0, "logo", "image")); break; }
                else badge.logo = req.body.logo;

            case "create":
                let newBadge = await Badge.create(badge);
                res.status(201).json(messages.successCreated("Badge", newBadge.id));
        };
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.delete = async (req, res) => {
    try {
        if (req.loggedUser.role == "admin") {
            await Badge.destroy({ where: { id: req.params.id } });
            res.status(200).json({ msg: `Badge ${req.params.id} was successfully deleted!` });
        } else {
            res.status(403).json(messages.errorForbidden());
        }
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};


exports.verifyEvent = async (req, res) => {
    try {
        const badges = await Badge.findAll({ where: { conditionType: 'event' } });
        await req.user.countEvents()
            .then(count => {
                badges.forEach(async badge => {
                    if (count >= badge.value) {
                        await req.user.addBadge(badge);
                    };
                });
            });
    } catch (err) {
        console.log(err);
    };
};

exports.verifyActivity = async (req, res) => {
    try {
        if (!req.user) req.user = await User.findByPk(req.params.loggedUser.id);
        console.log("bom dia", 1)
        const badges = await Badge.findAll({ where: { conditionType: 'activity' } });
        console.log(req.user)
        await req.user.countActivities()
            .then(count => {
                console.log("bom dia", 2)
                badges.forEach(async badge => {
                    if (count >= badge.value) {
                        await req.user.addBadge(badge);
                    };
                });
            });
    } catch (err) {
        console.log(err);
    };
};
exports.verifyOccurrence = async (req, res) => {
    try {
        const badges = await Badge.findAll({ where: { conditionType: 'occurrence' } });
        await req.user.countOccurrences()
            .then(count => {
                badges.forEach(async badge => {
                    if (count >= badge.value) {
                        await req.user.addBadge(badge);
                    };
                });
            });
        next();
    } catch (err) {
        console.log(err);
    };
};
exports.verifyComment = async (req, res) => {
    try {
        const badges = await Badge.findAll({ where: { conditionType: 'comment' } });
        await req.user.countComments()
            .then(count => {
                badges.forEach(async badge => {
                    if (count >= badge.value) {
                        await req.user.addBadge(badge);
                    };
                });
            });
    } catch (err) {
        console.log(err);
    };
};
