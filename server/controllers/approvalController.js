const ApprovalRecord = require('../models/ApprovalRecord')
const Song = require('../models/Song')
const resetWeek = require('../utils/resetWeek')
const { currentWeekLabel } = require('./songController')

// GET /api/approvals/final-list
async function getFinalList(req, res) {
  try {
    const weekLabel = req.query.weekLabel || currentWeekLabel()
    const records = await ApprovalRecord.find({ weekLabel }).lean()

    // Group by song
    const bySong = {}
    records.forEach((r) => {
      const key = String(r.songId)
      if (!bySong[key]) bySong[key] = { songTitle: r.songTitle, members: [] }
      bySong[key].members.push({ name: r.memberName, voicePart: r.voicePart, approvedBy: r.approvedBy, approvedAt: r.approvedAt })
    })

    // Count active songs for the week
    const activeSongs = await Song.find({ isActive: true }).lean()
    const activeSongIds = new Set(activeSongs.map((s) => String(s._id)))

    // fullyCleared = members approved on EVERY active song
    const memberSongCount = {}
    records.forEach((r) => {
      if (!activeSongIds.has(String(r.songId))) return
      const key = String(r.memberId)
      if (!memberSongCount[key]) memberSongCount[key] = { name: r.memberName, voicePart: r.voicePart, count: 0 }
      memberSongCount[key].count++
    })
    const totalActive = activeSongIds.size
    const fullyCleared = Object.values(memberSongCount).filter((m) => m.count >= totalActive)

    res.json({ weekLabel, bySong: Object.values(bySong), fullyCleared })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/admin/reset-week  (admin only)
async function triggerReset(req, res) {
  try {
    const summary = await resetWeek()
    res.json({ message: 'Week reset complete.', summary })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getFinalList, triggerReset }
