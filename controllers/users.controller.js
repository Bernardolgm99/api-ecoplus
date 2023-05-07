const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption
const config = require("../config/config");
const db = require("../models/index.js");
const User = db.user;
const { ValidationError } = require("sequelize");

exports.create = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    let newUser = await User.create(req.body)
    res.status(201).json({
      sucess: true,
      msg: `User created successfully`,
      URL: `/users/${newUser.id}`
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
}

exports.login = async (req, res) => {
  try {
    if (!req.body || !req.body.username || !req.body.password)
      return res.status(400).json({ success: false, msg: "Must provide username and password." });

    let user = await User.findOne({ where: { username: req.body.username } }); //get user data from DB
    if (!user) return res.status(404).json({ success: false, msg: "User not found." });
    // tests a string (password in body) against a hash (password in database)
    const check = bcrypt.compareSync(req.body.password, user.password);
    if (!check) return res.status(401).json({ success: false, accessToken: null, msg: "Invalid credentials!" });
    // sign the given payload (user ID and role) into a JWT payload – builds JWT token, using secret key
    const token = jwt.sign({ id: user.id, role: user.role },
      config.SECRET, {
      expiresIn: '24h' // 24 hours
    });
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
    let findUser = await User.findByPk(req.params.userId)

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
      console.log('yau')
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
    } else if (req.body.block === true || req.body.block === false) {

      console.log(req.body.block)
      next()
    } else {
      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;
      if (req.body.address) user.address = req.body.address;
      if (req.body.postalCode) user.postalCode = req.body.postalCode;
      if (req.body.contact) user.contact = req.body.contact;
      if (req.body.schoolDesc) user.schoolDesc = req.body.schoolDesc;
      await User.update(
        {
          name: user.name,
          email: user.email,
          password: user.password,
          genreDesc: user.genreDesc,
          address: user.address,
          postalCode: user.postalCode,
          location: user.location,
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