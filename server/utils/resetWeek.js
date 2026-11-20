const Submission = require('../models/Submission')
const Song = require('../models/Song')
const { deleteFromCloudinary } = require('../middleware/upload')

/**
 * Weekly Reset — called by both the cron job and the admin endpoint.
 *
 * Steps:
 *  1. Delete Cloudinary audio for every unapproved submission, then delete those docs.
 *  2. For approved submissions: strip audioUrl + cloudinaryPublicId to free storage,
 *     but keep the text record so the history is intact.
 *  3. Delete Cloudinary reference tracks for all active songs, then archive them.
 *
 * Returns a summary object for the admin response / log.
 */
async function resetWeek() {
  const summary = { unapprovedDeleted: 0, approvedStripped: 0, songsArchived: 0, referenceTracksDeleted: 0, errors: [] }

  // --- Step 1: Unapproved submissions ---
  const unapproved = await Submission.find({ status: { $in: ['pending', 'revision_requested'] } })
  for (const sub of unapproved) {
    if (sub.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(sub.cloudinaryPublicId)
      } catch (err) {
        summary.errors.push(`Submission audio delete failed for ${sub.cloudinaryPublicId}: ${err.message}`)
      }
    }
    await sub.deleteOne()
    summary.unapprovedDeleted++
  }

  // --- Step 2: Strip audio from approved submissions (keep text) ---
  const approvedSubs = await Submission.find({ status: 'approved', cloudinaryPublicId: { $ne: '' } })
  for (const sub of approvedSubs) {
    if (sub.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(sub.cloudinaryPublicId)
      } catch (err) {
        summary.errors.push(`Approved audio delete failed for ${sub.cloudinaryPublicId}: ${err.message}`)
      }
    }
  }
  const stripResult = await Submission.updateMany(
    { status: 'approved' },
    { $set: { audioUrl: '', cloudinaryPublicId: '' } }
  )
  summary.approvedStripped = stripResult.modifiedCount

  // --- Step 3: Delete reference tracks from Cloudinary then archive songs ---
  const activeSongs = await Song.find({ isActive: true })
  for (const song of activeSongs) {
    if (song.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(song.cloudinaryPublicId)
        summary.referenceTracksDeleted++
      } catch (err) {
        summary.errors.push(`Reference track delete failed for ${song.cloudinaryPublicId}: ${err.message}`)
      }
    }
    // Clear the Cloudinary fields and archive
    song.isActive = false
    song.referenceAudioUrl = ''
    song.cloudinaryPublicId = ''
    await song.save()
    summary.songsArchived++
  }

  console.log('[WeeklyReset] Done:', summary)
  return summary
}

module.exports = resetWeek

