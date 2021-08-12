const express = require('express')


const router = express.Router()

const User = require('../../models/user')


//Login
router.get('/login', (req, res) => {
  res.render('login')
})


//Register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!name | !email | !password | !confirmPassword) {
    error.push({ message: '所有的欄位都是必填！' })
  }

  if (password !== confirmPassword) {
    error.push({ message: '密碼與確認密碼不相符！' })
  }

  if (errors.length > 0) {
    return res.render('register', { errors, name, email, password, confirmPassword })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '此email已經註冊過了！' })
        return res.render('register', { errors, name, email, password, confirmPassword })
      }
      User.create({ name, email, password })
        .then(() => res.redirect('/users/login'))
        .catch(error => console.log(error))
    })






  res.render('register')
})

module.exports = router