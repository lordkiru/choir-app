const router = require('express').Router()
const { protect } = require('../middleware/auth')
const ApprovalRecord = require('../models/ApprovalRecord')

router.get('/', protect, async (req, res) => {
  try {
    const { search, from, to } = req.query
    const dateFilter = {}
    if (from) dateFilter['$gte'] = new Date(from)
    if (to) { const d = new Date(to); d.setHours(23,59,59,999); dateFilter['$lte'] = d }
    const recordFilter = {}
    if (Object.keys(dateFilter).length) recordFilter.approvedAt = dateFilter
    if (search) {
      recordFilter['$or'] = [
        { weekLabel: { '$regex': search, '$options': 'i' } },
        { songTitle: { '$regex': search, '$options': 'i' } },
        { memberName: { '$regex': search, '$options': 'i' } },
      ]
    }
    const records = await ApprovalRecord.find(recordFilter).sort({ approvedAt: -1 }).lean()
    const weekMap = {}
    records.forEach((r) => {
      if (!weekMap[r.weekLabel]) weekMap[r.weekLabel] = { weekLabel: r.weekLabel, earliestDate: r.approvedAt, songs: {}, memberSongMap: {} }
      const w = weekMap[r.weekLabel]
      const sk = String(r.songId)
      if (!w.songs[sk]) w.songs[sk] = { title: r.songTitle, approvedCount: 0 }
      w.songs[sk].approvedCount++
      const mk = String(r.memberId)
      if (!w.memberSongMap[mk]) w.memberSongMap[mk] = { name: r.memberName, voicePart: r.voicePart, songs: new Set() }
      w.memberSongMap[mk].songs.add(sk)
    })
    const weeks = Object.values(weekMap).map((w) => {
      const totalSongs = Object.keys(w.songs).length
      const qualifiedMembers = Object.values(w.memberSongMap)
        .filter((m) => m.songs.size >= totalSongs)
        .map((m) => ({ name: m.name, voicePart: m.voicePart }))
        .sort((a, b) => a.name.localeCompare(b.name))
      return { weekLabel: w.weekLabel, earliestDate: w.earliestDate, totalSongs, songs: Object.values(w.songs).sort((a, b) => a.title.localeCompare(b.title)), qualifiedCount: qualifiedMembers.length, qualifiedMembers }
    }).sort((a, b) => new Date(b.earliestDate) - new Date(a.earliestDate))
    const pqMap = {}
    Object.values(weekMap).forEach((w) => {
      const t = Object.keys(w.songs).length
      Object.entries(w.memberSongMap).forEach(([id, m]) => {
        if (m.songs.size >= t) { if (!pqMap[id]) pqMap[id] = { name: m.name, voicePart: m.voicePart, weeksQualified: 0 }; pqMap[id].weeksQualified++ }
      })
    })
    const ppMap = {}
    Object.values(weekMap).forEach((w) => Object.entries(w.memberSongMap).forEach(([id, m]) => {
      if (!ppMap[id]) ppMap[id] = { name: m.name, voicePart: m.voicePart, weeksParticipated: 0 }; ppMap[id].weeksParticipated++
    }))
    const qIds = new Set(Object.keys(pqMap))
    const periodQualified = Object.values(pqMap).sort((a, b) => b.weeksQualified - a.weeksQualified || a.name.localeCompare(b.name))
    const neverQualified = Object.entries(ppMap).filter(([id]) => !qIds.has(id)).map(([, m]) => ({ name: m.name, voicePart: m.voicePart, weeksParticipated: m.weeksParticipated })).sort((a, b) => a.name.localeCompare(b.name))
    res.json({ weeks, total: weeks.length, periodQualified, neverQualified })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router