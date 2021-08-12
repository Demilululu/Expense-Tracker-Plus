const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')


router.get('/', (req, res) => {
  let total_expense = 0
  let category_info = []
  const viewBy = req.query.viewBy
  const filterBy = {}

  if (viewBy) {
    filterBy.category = viewBy
  }

  Record.find(filterBy)
    .lean()
    .then(records => {
      Category.find()
        .lean()
        .then((category) => {
          category_info.push(...category)
          records.forEach((record) => {
            let categories = category.find(category => record.category === category.name)
            record.category_label = categories.label
            record.category_icon = categories.icon
            record.match_id = categories.id
          })
        })
        .then(() => {
          records.forEach((record) => { total_expense += record.cost })
          res.render('index', { records, total_expense, category_info, viewBy })
        })
    })
})

module.exports = router