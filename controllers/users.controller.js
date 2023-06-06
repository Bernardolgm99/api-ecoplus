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
    if (!req.body.contact) { res.status(400).json(messages.errorBadRequest(1, "contact")); return }


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
    let users = await User.findAll({
      include: [
        { model: db.badge, through: { attributes: [] } },
        { model: db.event, through: { attributes: [] } },
        { model: db.activity, through: { attributes: [] } },
        { model: db.occurrence }
      ]
    })
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
    if (req.loggedUser == undefined) findUser = await User.findOne({ where: { id: req.params.userId }, include: [{ model: Badge }, { model: db.event }] }, {})
    else findUser = await User.findOne({ where: { id: req.loggedUser.id }, include: [{ model: Badge }, { model: db.event }] }, {})
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

      if (req.loggedUser.role == 'admin') {

        User.destroy({
          where: { id: req.params.userId }
        })

        res.status(200).json({
          sucess: true,
          msg: `User ${user.username} deleted successfully`
        })

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

        if (req.body.username && req.body.username != "string") { res.status(400).json(messages.errorBadRequest(0, "username", "string")); return }
        else if (req.body.username) {
          if (await User.findOne({ where: { username: req.body.username } })) {
            res.status(400).json({ success: false, message: `Username already in use.` });
            return
          } else user.username = req.body.username
        } else user.username = user.username

        if (req.body.email && req.body.email != "string") { res.status(400).json(messages.errorBadRequest(0, "email", "string")); return }
        else if (req.body.email) {
          if (await User.findOne({ where: { email: req.body.email } })) {
            res.status(400).json({ success: false, message: `Email already in use.` });
            return
          } else user.email = req.body.email
        } else user.email = user.email

        if (req.body.password && req.body.password != "string") { res.status(400).json(messages.errorBadRequest(0, "password", "string")); return }
        else if (req.body.password) { user.password = bcrypt.hashSync(req.body.password, 10) }
        else user.password = user.password

        if (req.body.schoolDesc && !School.findOne({ where: { school: req.body.schoolDesc } })) { res.status(400).json(messages.errorBadRequest(2, "schoolDesc")); return }
        else if (req.body.schoolDesc) {
          user.schoolDesc = req.body.schoolDesc
        } else { user.schoolDesc = user.schoolDesc }

        if ((req.body.contact && typeof req.body.contact != "number")) { res.status(400).json(messages.errorBadRequest(0, "contact", "number")); return }
        if (req.body.contact) {
          if (await User.findOne({ where: { contact: req.body.contact } })) {
            res.status(400).json({ success: false, message: `Phone Number already in use.` }); return
          } else user.contact = req.body.contact
        } else user.contact = user.contact


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


exports.block = async (req, res) => {
  try {

    if (req.loggedUser.role == 'admin') {

      let user = await User.findByPk(req.params.userId)

      if (user == undefined || user == null) {
        console.log('yau')
        res.status(404).json({
          sucess: false,
          msg: `User not found`
        })

      } else if (typeof req.body.block == 'string') {
        res.status(400).json({
          success: false,
          msg: `Invalid value!`
        })

      } else {

        User.update({ block: req.body.block },
          {
            where: { id: req.params.userId }
          })

        res.status(202).json({
          succes: true,
          msg: `User ${user.username} updated successfully. Block is now set to ${req.body.block}`
        })
      }
    } else {
      res.status(403).json({ message: `You are not allowed to block this user.` })
    }

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
}