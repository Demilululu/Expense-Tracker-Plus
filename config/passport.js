const passport = require('passport')
const bcrypt = require('bcryptjs')

const LocalStrategy = require('passport-local').Strategy

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  //Set Local Strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false)
        }
        bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false)
          }
          return done(null, user)
        })
      })
  }))

  //Serialise and Deserialise
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => done(error, null))
  })

}
