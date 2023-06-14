const db = require('../models/index');
const Mission = db.mission;
const User = db.user;
const { validationDate, validationImage } = require('../utilities/validation');
const messages = require('../utilities/messages');

exports.findAll = async (req, res) => {
    try {
        let missions
        if (req.params.userId == undefined) missions = await Mission.findAll({ order: [['createdAt']] })
        else {
            let thisUser = await User.findByPk(req.params.userId, { include: { model: Mission, through: { attributes: [] } } })
            missions = await thisUser.getMissions()
        }
        res.status(200).json(missions);
        console.log(missions)
    } catch (err) {
        console.log(err)
        /* res.status(500).json(messages.errorInternalServerError()); */
    };
}

exports.create = async (req, res) => {
    try {
        if (req.loggedUser.role != 'admin') return res.status(401).json(messages.errorUnathorized())
        let mission = {}
        if (!req.body.name) res.status(400).json(messages.errorBadRequest(1, "name"));
        if (!req.body.description) res.status(400).json(messages.errorBadRequest(1, "description"));
        if (!req.body.typeOf) res.status(400).json(messages.errorBadRequest(1, "typeOf"));
        if (!req.body.end) res.status(400).json(messages.errorBadRequest(1, "end"));
        if (!req.body.objective) res.status(400).json(messages.errorBadRequest(1, "objective"));
        //if (!req.body.image) res.status(400).json(messages.errorBadRequest(1, "image"));

        if (typeof (req.body.name) != "string") res.status(400).json(messages.errorBadRequest(0, "name", "string"))
        else mission.name = req.body.name;
        if (typeof (req.body.description) != "string") res.status(400).json(messages.errorBadRequest(0, "description", "string"))
        else mission.description = req.body.description;
        if (typeof (req.body.typeOf) != "string") res.status(400).json(messages.errorBadRequest(0, "typeOf", "string"))
        else mission.typeOf = req.body.typeOf;
        if (typeof (req.body.end) != "number") res.status(400).json(messages.errorBadRequest(0, "end", "integer"))
        else mission.end = req.body.end;
        if (typeof (req.body.objective) != "number") res.status(400).json(messages.errorBadRequest(0, "objective", "integer"))
        else mission.objective = req.body.objective;

        let newMission = await Mission.create(mission);
        res.status(201).json(messages.successCreated("mission", newMission.id))
        //if (validationImage(req.body.image)) res.status(400).json(messages.errorBadRequest(0, "objective", "integer"))
        //else mission.objective = req.body.objective;
    } catch (err) {
        console.log(err);
        res.status(500).json(messages.errorInternalServerError());
    };
}

exports.edit = async (req, res) => {
    try {
        if (req.loggedUser.role != 'admin') res.status(401).json(messages.errorUnathorized())
        let mission = await Mission.findByPk(req.params.missionId);
        if (!mission) res.status(404).json({ error: `${req.params.missionId} not founded` });

        let updateMission = {}
        if (req.body.name && typeof (req.body.name) != "string") res.status(400).json(messages.errorBadRequest(0, "name", "string"))
        else updateMission.name = req.body.name;
        if (req.body.description && typeof (req.body.description) != "string") res.status(400).json(messages.errorBadRequest(0, "description", "string"))
        else updateMission.description = req.body.description;
        if (req.body.typeOf && typeof (req.body.typeOf) != "string") res.status(400).json(messages.errorBadRequest(0, "type", "string"))
        else updateMission.typeOf = req.body.typeOf;
        if (req.body.end && typeof (req.body.end) != "number") res.status(400).json(messages.errorBadRequest(0, "end", "integer"))
        else updateMission.end = req.body.end;
        if (req.body.objective && typeof (req.body.objective) != "number") res.status(400).json(messages.errorBadRequest(0, "objective", "integer"))
        else updateMission.objective = req.body.objective;
        //if (req.body.image) res.status(400).json(messages.errorBadRequest(1, "image"));

        await Mission.update(updateMission, { where: { id: mission.id } });
        res.status(200).json({ msg: `Mission ${updateMission.id} was successfully changed!` });
    } catch (err) {
        console.log(err);
        res.status(500).json(messages.errorInternalServerError());
    };
}

exports.delete = async (req, res) => {
    try {
        const mission = await Mission.findOne({ where: { id: req.params.missionId } })

        if (req.loggedUser.id == mission.userId || req.loggedUser.role == "admin") {
            await mission.destroy({ where: { id: req.params.missionId } });
            res.status(200).json({ msg: `Mission ${req.params.missionId} was successfully deleted!` });
        } else {
            res.status(403).json(messages.errorForbidden());
        }
    } catch (err) {
        res.status(500).json(messages.errorInternalServerError());
    };
}

exports.userMissions = async (req, res) => {
    try {
        let userMissions = await Mission.findAll({
            where: {
                createdAt: {
                    [Op.lt]: createdAt
                },
                isValid: true
            },
            order: [['createdAt', 'DESC']],
            offset: 0, limit: 3
        })
        res.status(200).json(userMissions);
    } catch (err) {

    }
}

exports.findOneById = async (req, res) => {
    try {
        let mission = await Mission.findByPk(req.params.missionId);
        if (!mission) {
            res.status(404).json({ error: `${req.params.missionId} not founded` });
        } else res.status(200).json(mission);
    } catch (err) {
        console.log(err);
        res.status(500).json(messages.errorInternalServerError());
    };
}

