const express = require('express')
const { sequelize } = require('./models/index')
const authRoutes = require('./routes/authRoutes')
const expenseRoutes = require('./routes/expenseRoutes')

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/expenses', expenseRoutes)

sequelize.sync({ force: false }).then(() => {
  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})