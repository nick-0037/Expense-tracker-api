const { Op } = require('sequelize')
const { Expense } = require('../models/index')

exports.addExpense = async (req, res) => {
  const { name, amount, category } = req.body
  const userId = req.user.get('id')

  if (!userId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  if (!name || !amount || !category) {
    return res.status(400).json({ error: 'Fields are required' })
  }

  try {
    const expense = await Expense.create({ name, amount, category, UserId: userId })
    res.status(201).json(expense)
  } catch(err) {
    res.status(400).json({ error: 'Error adding expense', details: err.message })
  }
}

exports.getExpense = async (req, res) => {
  const { filter, startDate, endDate } = req.query
  const userId = req.user.id

  let where = { UserId: userId }

  if(filter === 'weak') {
    where.date = { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  } else if(filter === 'month') {
    where.date = { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  } else if(filter === 'custom') {
    where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] }
  }

  try {
    const expenses = await Expense.findAll({ where }) 
    res.json(expenses)
  } catch(err) {
    res.status(500).json({ error: 'Error fetching expenses', details: err.message })
  }
}

exports.updateExpense = async (req, res) => {
  const { id } = req.params
  const { name, amount, category } = req.body
  const userId = req.user.id

  try {
    const expense = await Expense.findOne({ where: { id, UserId: userId } })
    if(!expense) return res.status(404).json({ error: 'Expense not found or not authorized'})

    expense.name = name || expense.name
    expense.amount = amount || expense.amount
    expense.category = category || expense.category

    await expense.save()
    res.status(200).json(expense)

  } catch(err) {
    res.status(500).json({ error: 'Error updating expense', details: err.message})
  }
}

exports.deleteExpense = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const expense = await Expense.findOne({ where: { id, UserId: userId } })
    if(!expense) return res.status(404).json({ error: 'Expense not found or not authorized'})

    await expense.destroy() 

    res.status(204).json({ message: 'Expense deleted successfully' })
  } catch(err) {
    res.status(500).json({ error: 'Error deleting expense', details: err.message })
  }
}