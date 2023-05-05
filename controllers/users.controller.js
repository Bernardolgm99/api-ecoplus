const db = require("../models/index.js");
const User = db.user;
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

exports.delete = async (req, res) => {
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

exports.edit = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.params.userId)

    if(user == undefined || user == null) {
      console.log('yau')
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
    } else if(req.body.block === true || req.body.block === false) {

        console.log(req.body.block)
        next()
        
      } else {
        User.update({username: req.body.username},
          {name: req.body.name},
          {email: req.body.email},
          {password: req.body.password},
          {genreDesc: req.body.genreDesc},
          {address: req.body.address},
          {postalCode: req.body.postalCode},
          {location: req.body.location},
          {birthDate: req.body.birthDate},
          {contact: req.body.contact},
          {schoolDesc: req.body.schoolDesc},
          {
            where: {id: req.params.userId}
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
    if(user == undefined || user == null) {
      console.log('yau')
      res.status(404).json({
        sucess: false,
        msg: `User not found`
      })
      
    } else if(typeof req.body.block == Boolean) {
      console.log(`yau2`)
      res.status(400).json({
        success: false,
        msg: `Invalid value!`
      })

    } else {
      console.log(`yau3`)
      User.update({block: req.body.block},  
      {
        where: {id: req.params.userId}
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