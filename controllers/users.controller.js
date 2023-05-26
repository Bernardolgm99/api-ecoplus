const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption
const config = require("../config/config");
const db = require("../models/index.js");
const User = db.user;
const Badge = db.badge;
const School = db.school;
const { ValidationError } = require("sequelize");
const validation = require('../utilities/validation.js')
const messages = require('../utilities/messages');

exports.create = async (req, res) => {
  try {

    if (!req.body.name) { res.status(400).json(messages.errorBadRequest(1, "name")); return }
    if (!req.body.username) { res.status(400).json(messages.errorBadRequest(1, "username")); return }
    if (!req.body.email) { res.status(400).json(messages.errorBadRequest(1, "email")); return }
    if (!req.body.password) { res.status(400).json(messages.errorBadRequest(1, "password")); return }
    if (!req.body.schoolDesc) { res.status(400).json(messages.errorBadRequest(1, "schoolDesc")); return }
    if (!req.body.birthDate) { res.status(400).json(messages.errorBadRequest(1, "birthDate")); return }


    if (typeof (req.body.name) != "string") { res.status(400).json(messages.errorBadRequest(0, "name", "string")); return };
    if (typeof (req.body.username) != "string") { res.status(400).json(messages.errorBadRequest(0, "username", "string")); return };
    if (typeof (req.body.email) != "string") { res.status(400).json(messages.errorBadRequest(0, "email", "string")); return };
    if (typeof (req.body.password) != "string") { res.status(400).json(messages.errorBadRequest(0, "password", "string")); return };
    if (validation.validationDates(req.body.birthDate)) { res.status(400).json(messages.errorBadRequest(0, "birthday", "instace of Date")); return };
    if (await School.findOne({ where: { school: req.body.schoolDesc } }).then(result => {
      if (result) return false;
      else return true
    })) { res.status(400).json(messages.errorBadRequest(2, "schoolDesc")); return };
    if (!!req.body.genreDesc && req.body.genreDesc.toUpperCase().includes(["M", "F", "OTHER"])) { res.status(400).json(messages.errorBadRequest(0, "genreDesc", `include in ["M", "F", "OTHER"]`)); return };
    if (!!req.body.contact && typeof (req.body.contact) != "number") { res.status(400).json(messages.errorBadRequest(0, "contact", "string")); return };


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

exports.login = async (req, res) => {
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
    return res.status(200).json({ success: true, accessToken: token });
  } catch (err) {
    if (err instanceof ValidationError)
      res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
    else
      res.status(500).json({ success: false, msg: err.message || "Some error occurred at login." });
  };
}

exports.findAll = async (req, res) => {
  try {
    let users = await User.findAll()
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
    let findUser = await User.findOne({ where: { id: req.params.userId }, include: [{ model: Badge }, {model: db.event}] }, {})

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

exports.delete = async (req, res) => {
  try {
    let user = await User.findByPk(req.params.userId)

    if (user == undefined || user == null) {
      console.log('yau')
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
    } else {

      User.destroy({
        where: { id: req.params.userId }
      })

      res.status(200).json({
        sucess: true,
        msg: `User ${user.username} deleted successfully`
      })
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
    if (user == undefined || user == null) {
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
    } else {
      if (!!req.body.username && req.body.username != "string") { res.status(400).json(messages.errorBadRequest(0, "username", "string")); return }
      else user.username = req.body.username;
      if (!!req.body.email && req.body.email != "string") { res.status(400).json(messages.errorBadRequest(0, "email", "string")); return }
      else user.email = req.body.email;
      if (!!req.body.password && req.body.password != "string") { res.status(400).json(messages.errorBadRequest(0, "password", "string")); return }
      else user.password = bcrypt.hashSync(req.body.password, 10);
      if (!!req.body.schoolDesc && School.findOne({ where: { school: req.body.schoolDesc } })) { res.status(400).json(messages.errorBadRequest(2, "schoolDesc")); return }
      else user.schoolDesc = req.body.schoolDesc;
      if (!!req.body.contact && req.body.contact != "string") { res.status(400).json(messages.errorBadRequest(0, "contact", "string")); return }
      else user.contact = req.body.contact;


      await User.update(
        {
          name: user.name,
          email: user.email,
          password: user.password,
          genreDesc: user.genreDesc,
          birthDate: user.birthDate,
          contact: user.contact,
          schoolDesc: user.schoolDesc
        },
        {
          where: { id: req.params.userId }
        }
      )

      res.status(202).json({
        succes: true,
        msg: `User ${user.username} updated successfully`
      })
    }

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
}

exports.block = async (req, res) => {
  try {
    let user = await User.findByPk(req.params.userId)
    if (user == undefined || user == null) {
      console.log('yau')
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })

    } else if (typeof req.body.block == Boolean) {
      console.log(`yau2`)
      res.status(400).json({
        success: false,
        msg: `Invalid value!`
      })

    } else {
      console.log(`yau3`)
      User.update({ block: req.body.block },
        {
          where: { id: req.params.userId }
        })

      res.status(202).json({
        succes: true,
        msg: `User ${user.username} updated successfully. Block is now set to ${req.body.block}`
      })
    }

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
}