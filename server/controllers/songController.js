const Song = require('../models/Song')
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload')

// Utility: label for the current week
function currentWeekLabel() {
  const d = new Date()
  return `Week of ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

// POST /api/songs  (admin only)
async function createSong(req, res) {
  try {
    const { title, composer } = req.body
    if (!title) return res.status(400).json({ error: 'Title is required.' })

    let referenceAudioUrl = ''
    let cloudinaryPublicId = ''

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'choir-app/reference-tracks')
      referenceAudioUrl = result.url
      cloudinaryPublicId = result.publicId
    }

    const song = await Song.create({
      title,
      composer,
      referenceAudioUrl,
      cloudinaryPublicId,
      weekLabel: currentWeekLabel(),
      isActive: true,
    })

    res.status(201).json({ song })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/songs/active
async function getActiveSongs(req, res) {
  try {
    const songs = await Song.find({ isActive: true }).sort({ createdAt: -1 })
    res.json({ songs })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/songs/:id  (admin only)
async function deleteSong(req, res) {
  try {
    const song = await Song.findById(req.params.id)
    if (!song) return res.status(404).json({ error: 'Song not found.' })
    if (song.cloudinaryPublicId) await deleteFromCloudinary(song.cloudinaryPublicId)
    await song.deleteOne()
    res.json({ message: 'Song deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { createSong, getActiveSongs, deleteSong, currentWeekLabel }
