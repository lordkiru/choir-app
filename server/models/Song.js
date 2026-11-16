const mongoose = require('mongoose')

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    composer: { type: String, trim: true },
    referenceAudioUrl: { type: String },
    cloudinaryPublicId: { type: String },
    sheetMusicUrl: { type: String },
    isActive: { type: Boolean, default: true },
    weekLabel: { type: String }, // e.g. "Week of Nov 15, 2026"
  },
  { timestamps: true }
)

module.exports = mongoose.model('Song', songSchema)
