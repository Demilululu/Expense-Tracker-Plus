const express = require('express')
const dayjs = require('dayjs')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')


router.get('/', (req, res) => {
  let total_expense = 0
  const category = []
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const userId = req.user._id
  const { viewByCategory, viewByMonth } = req.query
  const filterBy = { userId }

  if (viewByCategory) {
    filterBy.category = viewByCategory
  }

  if (viewByMonth) {
    const selectMonth = dayjs().month(viewByMonth)
    console.log(dayjs(selectMonth).startOf('month').toDate(), dayjs(selectMonth).endOf('month').toDate())
    filterBy.date = {
      $gte: dayjs(selectMonth).startOf('month').toDate(),
      $lte: dayjs(selectMonth).endOf('month').toDate()
    }
  }

  Record.find(filterBy)
    .lean()
    .then(records => {
      Category.find()
        .lean()
        .then((categoryInfo) => {
          category.push(...categoryInfo)
          records.forEach((record) => {
            let categories = categoryInfo.find(category => record.category === category.name)
            record.category_label = categories.label
            record.category_icon = categories.icon
            record.match_id = categories.id
            record.date = dayjs(record.date).format('YYYY-MM-DD ddd')
          })
        })
        .then(() => {
          records.forEach((record) => { total_expense += record.amount })
          res.render('index', { records, total_expense, category, month, viewByCategory, viewByMonth })
        })
    })
})

module.exports = router