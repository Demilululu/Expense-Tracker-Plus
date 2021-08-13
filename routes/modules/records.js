const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

//New record
router.get('/new', (req, res) => {

  return Category.find()
    .lean()
    .then(category => res.render('new', { category_info: category }))
    .catch(error => console.log(error))
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, category, merchant, amount } = req.body

  return Record.create({ name, date, category, merchant, amount, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Edit record
router.get('/:record_id/edit', (req, res) => {
  const _id = req.params.record_id
  const userId = req.user._id
  const category_selected = req.body.category

  return Category.find()
    .lean()
    .then(category => {
      Record.findOne({ _id, userId })
        .lean()
        .then(record => res.render('edit', { record, category_selected, category_info: category }))
    })
    .catch(error => console.log(error))
})

router.put('/:record_id', (req, res) => {
  const _id = req.params.record_id
  const userId = req.user._id
  const { name, date, category, merchant, amount } = req.body

  return Record.findOneAndUpdate({ _id, userId }, { name, date, category, merchant, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Delete record
router.delete('/:record_id', (req, res) => {
  const _id = req.params.record_id
  const userId = req.user._id

  return Record.findOneAndDelete({ _id, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router