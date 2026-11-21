const router = require('express').Router()
const { protect } = require('../middleware/auth')
const ApprovalRecord = require('../models/ApprovalRecord')
const Song = require('../models/Song')
const Submission = require('../models/Submission')

// GET /api/history?search=&from=&to=
// Returns all distinct weeks, filtered by search term and/or date range.
// Each week shows: songs sung, approved members per song, qualified members count.
router.get('/', protect, async (req, res) => {
  try {
    const { search, from, to } = req.query

    // Build date filter on approvedAt
    const dateFilter = {}
    if (from) dateFilter.$gte = new Date(from)
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(23, 59, 59, 999)
      dateFilter.$lte = toDate
    }

    const recordFilter = {}
    if (Object.keys(dateFilter).length) recordFilter.approvedAt = dateFilter
    if (search) {
      recordFilter.$or = [
        { weekLabel: { $regex: search, $options: 'i' } },
        { songTitle: { $regex: search, $options: 'i' } },
        { memberName: { $regex: search, $options: 'i' } },
      ]
    }

    const records = await ApprovalRecord.find(recordFilter).sort({ approvedAt: -1 }).lean()

    // Group by weekLabel
    const weekMap = {}
    records.forEach((r) => {
      if (!weekMap[r.weekLabel]) {
        weekMap[r.weekLabel] = {
          weekLabel: r.weekLabel,
          earliestDate: r.approvedAt,
          songs: {},
          memberSongMap: {},
        }
      }
      const week = weekMap[r.weekLabel]

      // Track songs
      const songKey = String(r.songId)
      if (!week.songs[songKey]) week.songs[songKey] = { title: r.songTitle, approvedCount: 0 }
      week.songs[songKey].approvedCount++

      // Track member → songs for qualified calculation
      const memberKey = String(r.memberId)
      if (!week.memberSongMap[memberKey]) week.memberSongMap[memberKey] = { name: r.memberName, voicePart: r.voicePart, songs: new Set() }
      week.memberSongMap[memberKey].songs.add(songKey)
    })

    // Build response
    const weeks = Object.values(weekMap).map((w) => {
      const totalSongs = Object.keys(w.songs).length
      const qualifiedCount = Object.values(w.memberSongMap).filter((m) => m.songs.size >= totalSongs).length
      const qualifiedMembers = Object.values(w.memberSongMap)
        .filter((m) => m.songs.size >= totalSongs)
        .map((m) => ({ name: m.name, voicePart: m.voicePart }))
        .sort((a, b) => a.name.localeCompare(b.name))

      return {
        weekLabel: w.weekLabel,
        earliestDate: w.earliestDate,
        totalSongs,
        songs: Object.values(w.songs).sort((a, b) => a.title.localeCompare(b.title)),
        qualifiedCount,
        qualifiedMembers,
      }
    })

    // Sort weeks newest first
    weeks.sort((a, b) => new Date(b.earliestDate) - new Date(a.earliestDate))

    res.json({ weeks, total: weeks.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
