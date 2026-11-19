const ApprovalRecord = require('../models/ApprovalRecord')
const Song = require('../models/Song')
const Submission = require('../models/Submission')
const resetWeek = require('../utils/resetWeek')
const { currentWeekLabel } = require('./songController')

// GET /api/approvals/final-list
async function getFinalList(req, res) {
  try {
    const weekLabel = req.query.weekLabel || currentWeekLabel()
    const records = await ApprovalRecord.find({ weekLabel }).lean()

    // Group approvals by song
    const bySong = {}
    records.forEach((r) => {
      const key = String(r.songId)
      if (!bySong[key]) bySong[key] = { songTitle: r.songTitle, members: [] }
      bySong[key].members.push({ name: r.memberName, voicePart: r.voicePart, approvedBy: r.approvedBy, approvedAt: r.approvedAt })
    })

    // Active songs this week
    const activeSongs = await Song.find({ isActive: true }).lean()
    const activeSongIds = activeSongs.map((s) => String(s._id))
    const totalActive = activeSongIds.length

    // Qualified = submitted AND approved on EVERY active song
    // Step 1: find members who have an approved submission for every active song
    const memberMap = {} // memberId -> { name, voicePart, approvedSongs: Set }
    records.forEach((r) => {
      if (!activeSongIds.includes(String(r.songId))) return
      const key = String(r.memberId)
      if (!memberMap[key]) memberMap[key] = { name: r.memberName, voicePart: r.voicePart, approvedSongs: new Set() }
      memberMap[key].approvedSongs.add(String(r.songId))
    })

    // Step 2: also verify they have an actual submission record for every active song
    const qualifiedMembers = []
    for (const [memberId, info] of Object.entries(memberMap)) {
      if (info.approvedSongs.size < totalActive) continue // not approved on all songs
      // Confirm they submitted all songs
      const submittedCount = await Submission.countDocuments({
        member: memberId,
        song: { $in: activeSongIds },
        status: 'approved',
      })
      if (submittedCount >= totalActive) {
        qualifiedMembers.push({ name: info.name, voicePart: info.voicePart })
      }
    }

    // Sort qualified alphabetically
    qualifiedMembers.sort((a, b) => a.name.localeCompare(b.name))

    res.json({ weekLabel, bySong: Object.values(bySong), qualifiedMembers, totalSongs: totalActive })
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

