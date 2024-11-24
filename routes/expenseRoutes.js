const express = require('express')
const { addExpense, getExpense, updateExpense, deleteExpense } = require('../controllers/expenseController')
const { authenticate } = require('../middlewares/authMiddleware')

const router = express.Router() 

router.use(authenticate)

router.post('/', addExpense)
router.get('/', getExpense)
router.put('/:id', updateExpense)
router.delete('/:id', deleteExpense)

module.exports = router