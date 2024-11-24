const Sequelize = require('sequelize')
const sequelize = require('../config/config')

const User = sequelize.define('User', {
  username: { type: Sequelize.STRING, allowNull: false, unique: true},
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false, unique: false}
})

const Expense = sequelize.define('Expense', {
  name: { type: Sequelize.STRING, allowNull: false },
  amount: { type: Sequelize.FLOAT, allowNull: false },
  category: {
    type: Sequelize.ENUM('Food', 'Transportation', 'Entertainment', 'Shopping'),
    allowNull: false
  },
  UserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
})

User.hasMany(Expense, { onDelete: 'CASCADE' })
Expense.belongsTo(User)

module.exports = { sequelize, User, Expense }