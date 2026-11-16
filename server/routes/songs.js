const router = require('express').Router()
const { protect, requireRole } = require('../middleware/auth')
const { upload } = require('../middleware/upload')
const { createSong, getActiveSongs, deleteSong } = require('../controllers/songController')

router.get('/active', protect, getActiveSongs)
router.post('/', protect, requireRole('admin'), upload.single('referenceAudio'), createSong)
router.delete('/:id', protect, requireRole('admin'), deleteSong)

module.exports = router
