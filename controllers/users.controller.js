const db = require("../models/index.js");
const User = db.user;
const { ValidationError } = require("sequelize");

exports.createUser = async (req, res) => {
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

exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findByPk(req.params.userId)
    
    if(user == undefined || user == null) {
      console.log('yau')
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
    } else {

      User.destroy({
        where: {id: req.params.userId}
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

exports.editUser = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.params.userId)

    if(user == undefined || user == null) {
      console.log('yau')
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
    } else {

      if(req.body.block) {
        console.log(req.body.block)
        next()
      } else {
        User.update({
          where: {id: req.params.userId}
        },
        {username: req.body.username},
        {name: req.body.name},
        {email: req.body.email},
        {password: req.body.password},
        {genreDesc: req.body.genreDesc},
        {address: req.body.address},
        {postalCode: req.body.postalCode},
        {location: req.body.location},
        {birthDate: req.body.birthDate},
        {contact: req.body.contact},
        {schoolDesc: req.body.schoolDesc})
  
        res.status(202).json({
          succes: true,
          msg: `User ${user.username} updated successfully`
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

exports.blockUser = async (req, res) => {
  try {
    console.log(req.body.block)
    let user = await User.findByPk(req.params.userId)
    
    if(user == undefined || user == null) {
      console.log('yau')
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
      
    } else if(req.body.block > 1 || req.body.block < 0) {

      res.status(400).json({
        success: false,
        msg: `Invalid value!`
      })

    } else {
      
      User.update({
        where: {id: req.params.userId}
      },
      {block: req.body.block})
      
      res.status(202).json({
        succes: true,
        msg: `User ${user.username} updated successfully. Block is now set to ${user.block}`
      })
    }
    
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Some error occurred while creating a new user.'
    })
  }
}