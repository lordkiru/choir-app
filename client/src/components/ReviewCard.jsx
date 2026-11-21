import { useState } from 'react'
import { CheckCircle, MessageSquare } from 'lucide-react'

export default function ReviewCard({ submission, onReview }) {
  const [feedback, setFeedback] = useState(submission.leaderFeedback || '')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(submission.status === 'approved')

  async function handle(status) {
    setBusy(true)
    try {
      await onReview(submission._id, { status, leaderFeedback: feedback })
      if (status === 'approved') setDone(true)
    } finally { setBusy(false) }
  }

  return (
    <div className="glass p-5 flex flex-col gap-4" style={{ borderLeft: `3px solid ${done ? 'rgba(34,197,94,0.6)' : 'rgba(139,92,246,0.6)'}` }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold" style={{ color: '#e2d9f3' }}>{submission.member?.name}</p>
          <p className="text-sm font-medium mt-0.5" style={{ color: 'rgba(167,139,250,0.9)' }}>{submission.voicePartSnapshot}</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {new Date(submission.submittedAt).toLocaleString()}
          </p>
        </div>
        {done && <span className="chip-approved flex items-center gap-1"><CheckCircle size={11} /> Approved</span>}
      </div>

      {submission.audioUrl ? (
        <audio controls src={submission.audioUrl} className="w-full h-9 rounded-xl" style={{ accentColor: '#8b5cf6' }} />
      ) : (
        <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.3)' }}>No audio available.</p>
      )}

      {!done && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <MessageSquare size={12} /> Feedback (optional)
            </label>
            <textarea rows={2} value={feedback} onChange={(e) => setFeedback(e.target.value)}
              className="input-glass resize-none text-sm" placeholder="Leave a note for the member…" />
          </div>
          <div className="flex gap-3">
            <button disabled={busy} onClick={() => handle('approved')} className="btn-glass-green flex-1 text-sm py-2">
              {busy ? '…' : '✅ Approve'}
            </button>
            <button disabled={busy} onClick={() => handle('revision_requested')} className="btn-glass-red flex-1 text-sm py-2">
              {busy ? '…' : '🔄 Revision'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

