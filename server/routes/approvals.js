const router = require('express').Router()
const { protect, requireRole } = require('../middleware/auth')
const { getFinalList, triggerReset } = require('../controllers/approvalController')
const User = require('../models/User')

router.get('/final-list', protect, getFinalList)
router.post('/admin/reset-week', protect, requireRole('admin'), triggerReset)

// GET /api/approvals/admin/users — list all users (admin only)
router.get('/admin/users', protect, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ name: 1 }).lean()
    res.json({ users })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/approvals/admin/users/:id/role — update a user's role (admin only)
router.patch('/admin/users/:id/role', protect, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body
    if (!['member', 'part_leader', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be member, part_leader or admin.' })
    }
    // Prevent admin from demoting themselves
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

// DELETE /api/approvals/admin/users/:id — delete a user (admin only)
router.delete('/admin/users/:id', protect, requireRole('admin'), async (req, res) => {
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

