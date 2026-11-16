import { useState } from 'react'
import { CheckCircle, MessageSquare, Play } from 'lucide-react'

export default function ReviewCard({ submission, onReview }) {
  const [feedback, setFeedback] = useState(submission.leaderFeedback || '')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(submission.status === 'approved')

  async function handle(status) {
    setBusy(true)
    try {
      await onReview(submission._id, { status, leaderFeedback: feedback })
      if (status === 'approved') setDone(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow p-5 flex flex-col gap-4 border-l-4 ${done ? 'border-green-500' : 'border-indigo-400'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-900">{submission.member?.name}</p>
          <p className="text-sm text-indigo-600 font-medium">{submission.voicePartSnapshot}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Submitted {new Date(submission.submittedAt).toLocaleString()}
          </p>
        </div>
        {done && (
          <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold">
            <CheckCircle size={13} /> Approved
          </span>
        )}
      </div>

      {/* Audio player */}
      {submission.audioUrl ? (
        <audio controls src={submission.audioUrl} className="w-full h-9" />
      ) : (
        <p className="text-xs text-gray-400 italic">No audio available.</p>
      )}

      {!done && (
        <>
          {/* Feedback textarea */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
              <MessageSquare size={13} /> Feedback (shown to member if revision requested)
            </label>
            <textarea
              rows={2}
              className="border border-gray-300 rounded-xl p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Optional note…"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              disabled={busy}
              onClick={() => handle('approved')}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-sm transition"
            >
              {busy ? '…' : '✅ Approve'}
            </button>
            <button
              disabled={busy}
              onClick={() => handle('revision_requested')}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-sm transition"
            >
              {busy ? '…' : '🔄 Request Revision'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
