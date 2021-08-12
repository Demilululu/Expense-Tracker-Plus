const Record = require('../record')
const recordData = require('./record.json')
const recordList = recordData.results

const db = require('../../config/mongoose')

db.once('open', () => {
  Record.create(...recordList)
    .then(() => {
      console.log('record seeder done!')
      db.close()
    })
})