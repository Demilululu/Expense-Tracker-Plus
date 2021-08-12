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
  const { name, date, category, cost } = req.body

  return Record.create({ name, date, category, cost })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Edit record
router.get('/:record_id/edit', (req, res) => {
  const id = req.params.record_id
  const category_selected = req.body.category

  return Category.find()
    .lean()
    .then(category => {
      Record.findById(id)
        .lean()
        .then(record => res.render('edit', { record, category_selected, category_info: category }))
    })
    .catch(error => console.log(error))
})

router.put('/:record_id', (req, res) => {
  const id = req.params.record_id
  const { name, date, category, cost } = req.body

  return Record.findByIdAndUpdate(id, { name, date, category, cost })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Delete record
router.delete('/:record_id', (req, res) => {
  const id = req.params.record_id

  return Record.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router