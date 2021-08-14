const express = require('express')
const dayjs = require('dayjs')
const localeData = require('dayjs/plugin/localeData')

const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

dayjs.extend(localeData)

//Home page with filtering function
router.get('/', async (req, res) => {
  let total_expense = 0
  const userId = req.user._id
  const { viewByCategory, viewByMonth } = req.query
  const filterBy = { userId }
  const expense = []
  const month = dayjs.months()
  const category = await Category.find().lean()
  
  if (viewByCategory) {
    filterBy.category = viewByCategory
  }
  
  if (viewByMonth) {
    const selectMonth = dayjs().month(month.indexOf(viewByMonth))
    filterBy.date = {
      $gte: dayjs(selectMonth).startOf('month').toDate(),
      $lte: dayjs(selectMonth).endOf('month').toDate()
    }
  }
  
  const records = await Record.find(filterBy).lean().sort({ date: 'asc' })

  records.forEach((record) => {
    expense.push(record.amount)
    let categories = category.find(category => record.category === category.name)
    record.category_label = categories.label
    record.category_icon = categories.icon
    record.match_id = categories.id
    record.date = dayjs(record.date).format('YYYY-MM-DD ddd')
  })

  if (expense.length !== 0) {
    total_expense = expense.reduce((x, y) => x + y)
  }
  res.render('index', { records, total_expense, category, month, viewByCategory, viewByMonth })
})

module.exports = router