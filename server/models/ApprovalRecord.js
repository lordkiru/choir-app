const mongoose = require('mongoose')

const approvalRecordSchema = new mongoose.Schema(
  {
    weekLabel: { type: String, required: true },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    songTitle: { type: String, required: true },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    memberName: { type: String, required: true },
    voicePart: { type: String, required: true },
    approvedBy: { type: String, required: true }, // Part Leader name
    approvedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model('ApprovalRecord', approvalRecordSchema)
