const router = require('express').Router()
const { protect, requireRole } = require('../middleware/auth')
const { getFinalList, triggerReset } = require('../controllers/approvalController')

router.get('/final-list', protect, getFinalList)
router.post('/admin/reset-week', protect, requireRole('admin'), triggerReset)

module.exports = router
