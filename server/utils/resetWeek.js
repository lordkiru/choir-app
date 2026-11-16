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
 *  3. Set all active songs to isActive: false (archives them).
 *
 * Returns a summary object for the admin response / log.
 */
async function resetWeek() {
  const summary = { unapprovedDeleted: 0, approvedStripped: 0, songsArchived: 0, errors: [] }

  // --- Step 1: Unapproved submissions ---
  const unapproved = await Submission.find({ status: { $in: ['pending', 'revision_requested'] } })
  for (const sub of unapproved) {
    if (sub.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(sub.cloudinaryPublicId)
      } catch (err) {
        summary.errors.push(`Cloudinary delete failed for ${sub.cloudinaryPublicId}: ${err.message}`)
      }
    }
    await sub.deleteOne()
    summary.unapprovedDeleted++
  }

  // --- Step 2: Strip audio from approved submissions (keep text) ---
  const stripResult = await Submission.updateMany(
    { status: 'approved' },
    { $set: { audioUrl: '', cloudinaryPublicId: '' } }
  )
  summary.approvedStripped = stripResult.modifiedCount

  // --- Step 3: Archive active songs ---
  const archiveResult = await Song.updateMany({ isActive: true }, { $set: { isActive: false } })
  summary.songsArchived = archiveResult.modifiedCount

  console.log('[WeeklyReset] Done:', summary)
  return summary
}

module.exports = resetWeek
