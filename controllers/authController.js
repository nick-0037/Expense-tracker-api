const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User } = require('../models/index')
const { Op } = require('sequelize')

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body
  const existingUser = await User.findOne({ where: { [Op.or]: [{email}, {username}] } })
  if (existingUser) {
    return res.status(400).json({ error: 'Email or username is already taken' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ username, email, password: hashedPassword })
    res.status(201).json({ message: 'User registered successfully', user })
  } catch(err) {
    res.status(400).json({ error: 'Error registering user', details: err.message })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  

  try {
    const user = await User.findOne({ where: { email } })
    if(!user) return res.status(404).json({ error: 'User not found'})
      
    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user.get('id') }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' })
    res.status(200).json({ message: 'Login successfully', token })
  } catch(err) {
    res.status(500).json({ error: 'Error logging in', details: err.message} )
  }
}