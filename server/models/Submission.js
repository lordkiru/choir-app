const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema(
  {
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    voicePartSnapshot: { type: String, required: true }, // e.g. "Tenor"
    audioUrl: { type: String },
    cloudinaryPublicId: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'revision_requested'],
      default: 'pending',
    },
    leaderFeedback: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// One submission per member per song (unique constraint)
submissionSchema.index({ song: 1, member: 1 }, { unique: true })

module.exports = mongoose.model('Submission', submissionSchema)
