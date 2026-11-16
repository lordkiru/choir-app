const router = require('express').Router()
const { protect, requireRole } = require('../middleware/auth')
const { upload } = require('../middleware/upload')
const {
  submitRecording,
  getMySubmissions,
  getForReview,
  reviewSubmission,
} = require('../controllers/submissionController')

router.post('/', protect, requireRole('member', 'part_leader', 'admin'), upload.single('audio'), submitRecording)
router.get('/my', protect, getMySubmissions)
router.get('/review', protect, requireRole('part_leader', 'admin'), getForReview)
router.patch('/:id/review', protect, requireRole('part_leader', 'admin'), reviewSubmission)

module.exports = router
