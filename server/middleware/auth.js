const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Verify JWT and attach user to req
async function protect(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorised. No token.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Attach lean user object (no password)
    req.user = await User.findById(decoded.id).select('-password').lean()
    if (!req.user) return res.status(401).json({ error: 'User not found.' })
    next()
  } catch {
    return res.status(401).json({ error: 'Token invalid or expired.' })
  }
}

// Role guard factory — usage: requireRole('admin') or requireRole('part_leader','admin')
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient role.' })
    }
    next()
  }
}

module.exports = { protect, requireRole }
