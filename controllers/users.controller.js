const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption
const config = require("../config/config");
const db = require("../models/index.js");
const User = db.user;
const Event = db.event;
const Occurrence = db.occurrence;
const Badge = db.badge;
const School = db.school;
const { Op } = require('sequelize');
const { ValidationError } = require("sequelize");
const validation = require('../utilities/validation.js')
const messages = require('../utilities/messages');

exports.create = async (req, res) => {
  try {
    console.log(req.body)
    if (!req.body.name) { res.status(400).json(messages.errorBadRequest(1, "name")); return }
    if (!req.body.username) { res.status(400).json(messages.errorBadRequest(1, "username")); return }
    if (!req.body.email) { res.status(400).json(messages.errorBadRequest(1, "email")); return }
    if (!req.body.password) { res.status(400).json(messages.errorBadRequest(1, "password")); return }
    if (!req.body.schoolDesc) { res.status(400).json(messages.errorBadRequest(1, "schoolDesc")); return }
    if (!req.body.birthDate) { res.status(400).json(messages.errorBadRequest(1, "birthDate")); return }
    if (!req.body.contact) { res.status(400).json(messages.errorBadRequest(1, "contact")); return }
    if (!req.body.genreDesc) { res.status(400).json(messages.errorBadRequest(1, "genreDesc")); return }
    if (!req.body.schoolId) { res.status(400).json(messages.errorBadRequest(1, "schoolId")); return }
    
    if (typeof (req.body.name) != "string") { res.status(400).json(messages.errorBadRequest(0, "name", "string")); return };
    if (typeof (req.body.username) != "string") { res.status(400).json(messages.errorBadRequest(0, "username", "string")); return };
    if (typeof (req.body.email) != "string") { res.status(400).json(messages.errorBadRequest(0, "email", "string")); return };
    if (typeof (req.body.password) != "string") { res.status(400).json(messages.errorBadRequest(0, "password", "string")); return };
    if (validation.validationDates(req.body.birthDate)) { res.status(400).json(messages.errorBadRequest(0, "birthday", "instace of Date")); return };
    if (await School.findOne({ where: { id: req.body.schoolId } }).then(result => {
      if (result) return false;
      else return true
    })) { res.status(400).json(messages.errorBadRequest(2, "schoolId")); return };
    if (!!req.body.genreDesc && req.body.genreDesc.toUpperCase().includes(["M", "F", "OTHER"])) { res.status(400).json(messages.errorBadRequest(0, "genreDesc", `include in ["M", "F", "OTHER"]`)); return };
    if (!!req.body.contact && typeof (req.body.contact) != "number") { res.status(400).json(messages.errorBadRequest(0, "contact", "string")); return };
    if (typeof (req.body.genreDesc) != "string") { res.status(400).json(messages.errorBadRequest(1, "genreDesc")); return }

    req.body.password = bcrypt.hashSync(req.body.password, 10);
    let newUser = await User.create(req.body)
    res.status(201).json({
      sucess: true,
      msg: `User created successfully`,
      URL: `/users/${newUser.id}`
    })
  } catch (err) {
    if (err.name == 'SequelizeUniqueConstraintError') {
      res.status(409).json({
        success: false,
        msg: `${err.errors[0].path} already exist`
      });
    } else {
      res.status(500).json({
        success: false,
        msg: err.message || 'Some error occurred while creating a new user.'
      })
    }
  }
} 

exports.login = async (req, res, next) => {
  try {
    if (!req.body || !req.body.username || !req.body.password)
      return res.status(400).json({ success: false, msg: "Must provide username and password." });

    const token = await User.findOne({ where: { username: req.body.username } })
      .then(user => {
        if (user.verifyPassword(req.body.password, user.password)) {
          return jwt.sign({ id: user.id, role: user.role },
            config.SECRET, {
            expiresIn: '24h' // 24 hours
          });
        };
        return false;
      });

    if (!token) return res.status(401).json({ success: false, accessToken: null, msg: "Invalid credentials!" });
    // sign the given payload (user ID and role) into a JWT payload – builds JWT token, using secret key
    res.status(200).json({ success: true, accessToken: token })
    next();
  } catch (err) {
    if (err instanceof ValidationError)
      res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
    else
      console.log(err)
    // res.status(500).json({ success: false, msg: err.message || "Some error occurred at login." });
  };
}

exports.findAll = async (req, res) => {
  try {
    let users = await User.findAll({
      attributes: ['id', 'username', 'role', 'icone', 'block', 'schoolId'],
      include: [
        { model: db.badge, attributes: ['id'], through: { attributes: [] } },
        { model: db.event, attributes: ['id'], through: { attributes: [] } },
        { model: db.activity, attributes: ['id'], through: { attributes: [] } },
        { model: db.occurrence, attributes: ['id'] }
      ]
    }
    )
    if (users != null) {
      res.status(200).json({
        success: true,
        message: users
      })
    } else {
      res.status(404).json({
        sucess: false,
        msg: `No users found`
      })
    }

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
}

exports.findOne = async (req, res) => {
  try {
    if (!req.loggedUser) findUser = await User.findOne({ where: { id: req.params.userId }, include: [
      { model: db.badge, through: { attributes: [] } },
      { model: db.event, attributes: ['id'], through: { attributes: [] } },
      { model: db.activity, attributes: ['id'], through: { attributes: [] } },
      { model: db.occurrence, attributes: ['id'] }
    ] })
    else findUser = await User.findOne({ where: { id: req.loggedUser.id }, include: [
      { model: db.badge, through: { attributes: [] } },
      { model: db.event, attributes: ['id'], through: { attributes: [] } },
      { model: db.activity, attributes: ['id'], through: { attributes: [] } },
      { model: db.occurrence, attributes: ['id'] }
    ] })
    if (findUser != null) {
      res.status(200).json({
        sucess: true,
        msg: findUser
      })
    } else {
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
    }

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
}

exports.delete = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.params.userId)

    if (user == undefined || user == null) {
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
    } else {

      if (req.loggedUser.role == 'admin') {

        User.destroy({
          where: { id: req.params.userId }
        })

        res.status(200).json({
          sucess: true,
          msg: `User ${user.username} deleted successfully`
        })
        next()

      } else {
        res.status(403).json({
          success: false,
          msg: `You do not have permission to delete this user.`
        })
      }

    }

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
}

exports.edit = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.params.userId)
    if (user == undefined) {
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
    } else {

      if (req.loggedUser.id == req.params.userId) {
        if (req.body.username && typeof req.body.username != "string") { res.status(400).json(messages.errorBadRequest(0, "username", "string")); return }
        else if (req.body.username) {
          if (await User.findOne({ where: { username: req.body.username } })) {
            res.status(400).json({ success: false, message: `Username already in use.` });
          } else user.username = req.body.username
        } else user.username = user.username

        if (req.body.email && typeof req.body.email != "string") { res.status(400).json(messages.errorBadRequest(0, "email", "string")); return }
        else if (req.body.email) {
          if (await User.findOne({ where: { email: req.body.email } })) {
            res.status(400).json({ success: false, message: `Email already in use.` });
          } else user.email = req.body.email
        } else user.email = user.email

        if (req.body.password && typeof req.body.password != "string") { res.status(400).json(messages.errorBadRequest(0, "password", "string")); return }
        else if (req.body.password) { user.password = bcrypt.hashSync(req.body.password, 10) }
        else user.password = user.password

        if (req.body.schoolId && !School.findOne({ where: { id: req.body.schoolId } })) { res.status(400).json(messages.errorBadRequest(2, "schoolId")); return }
        else if (req.body.schoolId) {
          user.schoolId = req.body.schoolId
        } else { user.schoolId = user.schoolId }

        if ((req.body.contact && typeof req.body.contact != "number")) { res.status(400).json(messages.errorBadRequest(0, "contact", "number")); return }
        if (req.body.contact) {
          if (await User.findOne({ where: { contact: req.body.contact } })) {
            res.status(400).json({ success: false, message: `Phone Number already in use.` }); return
          } else user.contact = req.body.contact
        } else user.contact = user.contact

        if ((req.body.genreDesc && typeof req.body.genreDesc != "string")) { res.status(400).json(messages.errorBadRequest(0, "genreDesc", "string")); return }
        if (req.body.genreDesc) {
          if (req.body.genreDesc != "M" && req.body.genreDesc != "F" && req.body.genreDesc != "OTHER") res.status(400).json(messages.errorBadRequest(0, "genreDesc", "M, F or Other"))
          else user.genreDesc = req.body.genreDesc;
        } else user.genreDesc = user.genreDesc
        
        if ((req.body.birthDate && typeof req.body.birthDate != "string")) { res.status(400).json(messages.errorBadRequest(0, "birthDate", "string")); return }
        if (req.body.birthDate) {
          if (validation.validationDates(req.body.birthDate)) { res.status(400).json(messages.errorBadRequest(0, "birthday", "instace of Date")); return }
        } else user.birthDate = user.birthDate

        await User.update(
          {
            username: user.username,
            email: user.email,
            password: user.password,
            schoolId: user.schoolId,
            contact: user.contact,
            genreDesc: user.genreDesc,
            birthDate: user.birthDate
          },
          {
            where: { id: req.params.userId }
          }
        )

        res.status(202).json({
          succes: true,
          msg: `User ${user.username} updated successfully`
        })
        next()

      } else {
        res.status(401).json({
          succes: false,
          msg: `You are not allowed to update this user`
        })

      }
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
}

exports.changeRoleOrBlock = async (req, res, next) => {
  try {
    if (req.loggedUser.role === 'admin') {

    if(req.body.role && typeof(req.body.role) != 'string') { messages.errorBadRequest(0, 'role', 'string'); return;}
    if(req.body.block && typeof(req.body.block) != 'boolean') { messages.errorBadRequest(0, 'block', 'boolean'); return;}

    let user = await User.findByPk(req.params.userId)
    if (user == undefined) { res.status(404).json(messages.errorNotFound()); return; }
    
    if (req.body.role) user.role = req.body.role;
    if (typeof(req.body.block) == "boolean") user.block = req.body.block;
    await user.save()

    res.status(200).json(messages.successOk);
    next();
    } else {
      res.status(401).json(messages.errorUnathorizedErrorMessage());
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(messages.errorInternalServerError())
  };
}

exports.findAllEventsOccurrences = async (req, res) => {
  try {
    let page = 0, limit = 5, createdAt = new Date();
    if (req.query.page)
      page = +req.query.page;

    if (req.query.limit)
      limit = +req.query.limit;

    if (req.query.createdAt)
      createdAt = req.query.createdAt;

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
        model: User,
        where: { id: req.params.userId },
        through: { attributes: [] }
      }]
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
        model: User,
        where: { id: req.params.userId }
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

exports.findAllEvents = async (req, res) => {
  try {
    let page = 0, limit = 5, createdAt = new Date();
    if (req.query.page)
      page = +req.query.page;

    if (req.query.limit)
      limit = +req.query.limit;

    if (req.query.createdAt)
      createdAt = req.query.createdAt;

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
        model: User,
        where: { id: req.params.userId },
        through: { attributes: [] }
      }]
    })

    res.status(200).json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json(messages.errorInternalServerError());
  };

}

exports.findAllOccurrences = async (req, res) => {
  try {
    let page = 0, limit = 5, createdAt = new Date();
    if (req.query.page)
      page = +req.query.page;

    if (req.query.limit)
      limit = +req.query.limit;

    if (req.query.createdAt)
      createdAt = req.query.createdAt;

    if (typeof (page) != 'number') { res.status(400).json(messages.errorBadRequest(0, "page", "number")); return; };

    if (typeof (limit) != 'number') { res.status(400).json(messages.errorBadRequest(0, "limit", "number")); return; };

    let occurrences = await Occurrence.findAll({
      where: {
        createdAt: {
          [Op.lt]: createdAt
        }
      },
      order: [['createdAt', 'DESC']],
      offset: page, limit: limit,
      include: [{
        model: User,
        where: { id: req.params.userId }
      }]
    })

    res.status(200).json(occurrences);
  } catch (err) {
    console.log(err);
    res.status(500).json(messages.errorInternalServerError());
  };
}