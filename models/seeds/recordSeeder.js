const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Record = require('../record')
const User = require('../user')
const recordList = require('./record.json').results

const db = require('../../config/mongoose')

const SEED_USER = {
  name: 'User1',
  email: 'user1@example.com',
  password: '12345678'
}

db.once('open', () => {

  return bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({ name: SEED_USER.name, email: SEED_USER.email, password: hash }))
    .then(user => {
      const userId = user._id
      recordList.forEach(record => record.userId = userId)
      return Record.create(...recordList)
    })
    .then(() => {
      console.log('record seeder done!')
      db.close()
    })
})