const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')
const routes = require('./routes/index')

const app = express()
const PORT = process.env.PORT || 3000

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
  secret: process.env.SESSION_SECRETE,
  resave: false,
  saveUninitialized: true
}))


app.use(routes)

app.listen(PORT, () => {
  console.log(`App is now running on http://localhost:${PORT}`)
})