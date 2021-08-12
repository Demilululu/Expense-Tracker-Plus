const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')

const router = express.Router()

const User = require('../../models/user')


//Login
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))


//Register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!name | !email | !password | !confirmPassword) {
    errors.push({ message: '所有的欄位都是必填！' })
  }

  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }

  if (errors.length > 0) {
    return res.render('register', { errors, name, email, password, confirmPassword })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '此email已經註冊過了！' })
        res.render('register', { errors, name, email, password, confirmPassword })
      } else {
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => {
            User.create({ name, email, password: hash })
              .then(() => res.redirect('/users/login'))
              .catch(error => console.log(error))
          })
      }
    })
})


// Logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/user/login')
})


module.exports = router