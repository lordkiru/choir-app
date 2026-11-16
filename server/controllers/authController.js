const jwt = require('jsonwebtoken')
const User = require('../models/User')

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password, voicePart } = req.body
    if (!name || !email || !password || !voicePart) {
      return res.status(400).json({ error: 'All fields are required.' })
    }
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already registered.' })

    const user = await User.create({ name, email, password, voicePart })
    const token = signToken(user)
    res.status(201).json({ token, user: safeUser(user) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' })

    const match = await user.comparePassword(password)
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' })

    const token = signToken(user)
    res.json({ token, user: safeUser(user) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, voicePart: user.voicePart },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function safeUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, voicePart: user.voicePart }
}

module.exports = { register, login }
