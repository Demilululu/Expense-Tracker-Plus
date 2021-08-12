const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const usePassport = require('./config/passport')
require('./config/mongoose')
const routes = require('./routes/index')

const app = express()
const PORT = process.env.PORT

const hbs = exphbs.create({ defaultLayout: 'main', extname: '.hbs' })
hbs.handlebars.registerHelper('isEqual', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.login_error_msg = req.flash('login_error_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is now running on http://localhost:${PORT}`)
})