const Submission = require('../models/Submission')
const Song = require('../models/Song')
const ApprovalRecord = require('../models/ApprovalRecord')
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload')
const { currentWeekLabel } = require('./songController')

// POST /api/submissions  (member)
async function submitRecording(req, res) {
  try {
    const { songId } = req.body
    if (!songId) return res.status(400).json({ error: 'songId is required.' })
    if (!req.file) return res.status(400).json({ error: 'Audio file is required.' })

    const song = await Song.findById(songId)
    if (!song || !song.isActive) return res.status(404).json({ error: 'Song not found or no longer active.' })

    // Upload new audio to Cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.buffer, 'choir-app/submissions')

    // Check for existing submission (resubmit path)
    const existing = await Submission.findOne({ song: songId, member: req.user._id })
    if (existing) {
      // Delete old audio from Cloudinary
      if (existing.cloudinaryPublicId) {
        await deleteFromCloudinary(existing.cloudinaryPublicId).catch(() => {})
      }
      existing.audioUrl = url
      existing.cloudinaryPublicId = publicId
      existing.status = 'pending'
      existing.leaderFeedback = ''
      existing.submittedAt = new Date()
      await existing.save()
      return res.json({ submission: existing })
    }

    const submission = await Submission.create({
      song: songId,
      member: req.user._id,
      voicePartSnapshot: req.user.voicePart,
      audioUrl: url,
      cloudinaryPublicId: publicId,
    })

    res.status(201).json({ submission })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/submissions/my?songId=   (member — own status per song)
async function getMySubmissions(req, res) {
  try {
    const filter = { member: req.user._id }
    if (req.query.songId) filter.song = req.query.songId
    const submissions = await Submission.find(filter).populate('song', 'title').lean()
    res.json({ submissions })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/submissions/review?songId=   (part_leader — own voice part only)
async function getForReview(req, res) {
  try {
    const filter = {
      voicePartSnapshot: req.user.voicePart,
      status: { $in: ['pending', 'revision_requested'] },
    }
    if (req.query.songId) filter.song = req.query.songId
    const submissions = await Submission.find(filter)
      .populate('member', 'name voicePart')
      .populate('song', 'title')
      .sort({ submittedAt: 1 })
      .lean()
    res.json({ submissions })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PATCH /api/submissions/:id/review   (part_leader)
async function reviewSubmission(req, res) {
  try {
    const { status, leaderFeedback } = req.body
    if (!['approved', 'revision_requested'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or revision_requested.' })
    }

    const submission = await Submission.findById(req.params.id)
      .populate('member', 'name voicePart')
      .populate('song', 'title weekLabel')
    if (!submission) return res.status(404).json({ error: 'Submission not found.' })

    // Leaders can only review their own voice part
    if (submission.voicePartSnapshot !== req.user.voicePart) {
      return res.status(403).json({ error: 'You can only review your own voice part.' })
    }

    submission.status = status
    submission.leaderFeedback = leaderFeedback || ''
    await submission.save()

    // If approved — write permanent ApprovalRecord
    if (status === 'approved') {
      await ApprovalRecord.findOneAndUpdate(
        { songId: submission.song._id, memberId: submission.member._id },
        {
          weekLabel: submission.song.weekLabel || currentWeekLabel(),
          songId: submission.song._id,
          songTitle: submission.song.title,
          memberId: submission.member._id,
          memberName: submission.member.name,
          voicePart: submission.voicePartSnapshot,
          approvedBy: req.user.name,
          approvedAt: new Date(),
        },
        { upsert: true, new: true }
      )
    }

    res.json({ submission })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { submitRecording, getMySubmissions, getForReview, reviewSubmission }
