const db = require('../models/index');
const messages = require('../utilities/messages');

exports.findAll = async (req, res) => {
    try {
        let schools = await db.school.findAll();
        res.status(200).json(schools);
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};

exports.findOne = async (req, res) => {
    try {
        let school = await db.school.findByPk(req.params.schoolId);
        res.status(200).json(school);
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
};