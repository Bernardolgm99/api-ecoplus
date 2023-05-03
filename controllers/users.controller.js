const db = require("../models/index.js");
const User = db.User;
const { ValidationError } = require("sequelize");

exports.create = async (req, res) => {
  console.log(req.body.location)
  try {
    let newUser = await User.create(req.body)
    console.log(`yau`)
    console.log(req.body)
    res.status(201).json({
      sucess: true,
      msg: `User created successfully`,
      URL: `/users/${newUser.id}`
    })

  } catch (err) {
    console.log("cenas");
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
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