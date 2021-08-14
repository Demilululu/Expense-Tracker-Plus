const express = require('express')
const dayjs = require('dayjs')

const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

//New record
router.get('/new', async (req, res) => {
  const category = await Category.find().lean()

  return res.render('new', { category })
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, category, merchant, amount } = req.body

  return Record.create({ name, date, category, merchant, amount, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Edit record
router.get('/:record_id/edit', async (req, res) => {
  const _id = req.params.record_id
  const userId = req.user._id
  const category_selected = req.body.category
  const category = await Category.find().lean()

  return Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      record.date = dayjs(record.date).format('YYYY-MM-DD')
      res.render('edit', { record, category_selected, category })
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