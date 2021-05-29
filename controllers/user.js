const { validationResult } = require('express-validator')
const UserService = require('../services/user')
const DoctorService = require('../services/doctor')

class UserController {

  static async getAllUsersPage(req, res) {
    let users = await UserService.findAll()
    res.render('users', {users})
  }

  static async createUserPage(req, res) {
    res.render('users-new', { errors: req.flash('errors') })
  }

  static async createUser(req, res) {
    let dao = req.body
    let validResults = validationResult(req)

    if (validResults.errors.length > 0) {
      req.flash('errors', validResults.errors)
      res.redirect('/users/new')
    } else {
      try {
        // check for same username
        let sameUsername1 = await DoctorService.findByUsername(dao.username)
        let sameUsername2 = await UserService.findByUsername(dao.username)
        if (sameUsername1 || sameUsername2) {
          return res.render('users-new', { error_msg: 'Username is taken', errors: [] })
        }
        let newUser = await UserService.create(dao)
        res.redirect('/users')
      } catch (err) {
        console.log(err)
        res.redirect('/users')
      }
    }
  }

  static async removeUser(req, res) {
    try {
      await UserService.removeOne(req.params.user_id)
      res.redirect('/users')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/users')
    }
  }

}

module.exports = UserController