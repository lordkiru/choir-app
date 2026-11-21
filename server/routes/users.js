const router = require('express').Router()
const { protect, requireRole } = require('../middleware/auth')
const User = require('../models/User')

// GET /api/users — list all users (admin only)
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ name: 1 }).lean()
    res.json({ users })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/users/:id/role — update role (admin only)
router.patch('/:id/role', protect, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body
    if (!['member', 'part_leader', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be member, part_leader or admin.' })
    }
    if (String(req.user._id) === req.params.id && role !== 'admin') {
      return res.status(400).json({ error: 'You cannot change your own role.' })
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password').lean()
    if (!user) return res.status(404).json({ error: 'User not found.' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/users/:id — delete a user (admin only)
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' })
    }
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found.' })
    res.json({ message: 'User deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
