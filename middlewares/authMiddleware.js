const jwt = require('jsonwebtoken')
const { User } = require('../models/index')

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if(!token) return res.status(401).json({ message: 'Not token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })

    req.user = await User.findByPk(decoded.id)

    if(!req.user) throw new Error('User not found')

    next()
  } catch(err) {
    return res.status(401).json({ error: 'Unauthorized', details: err.message })
  }
}