import { CheckCircle, Clock, AlertCircle, Mic } from 'lucide-react'

const STATUS = {
  pending: { label: 'Pending Review', chip: 'chip-pending', Icon: Clock },
  approved: { label: 'Approved', chip: 'chip-approved', Icon: CheckCircle },
  revision_requested: { label: 'Revision Requested', chip: 'chip-revision', Icon: AlertCircle },
}

export default function SongCard({ song, submission, onRecord }) {
  const s = submission ? STATUS[submission.status] : null

  return (
    <div className="glass p-5 flex flex-col gap-3 hover:scale-[1.01] transition-transform">
      {/* Top accent bar */}
      <div className="h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.8), rgba(99,102,241,0.3), transparent)' }} />

      <div>
        <h2 className="text-base font-bold" style={{ color: '#e2d9f3' }}>{song.title}</h2>
        {song.composer && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>by {song.composer}</p>}
        {song.weekLabel && <p className="text-xs mt-1" style={{ color: 'rgba(167,139,250,0.7)' }}>{song.weekLabel}</p>}
      </div>

      {s && (
        <div className={s.chip + ' flex items-center gap-1.5 w-fit'}>
          <s.Icon size={11} />
          {s.label}
        </div>
      )}

      {submission?.status === 'revision_requested' && submission.leaderFeedback && (
        <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
          <span className="font-semibold">Feedback: </span>
          {submission.leaderFeedback}
        </div>
      )}

      <button onClick={() => onRecord(song)} className="btn-glass mt-auto text-sm flex items-center justify-center gap-2 py-2.5">
        <Mic size={14} />
        {submission ? 'Re-record & Submit' : 'Record & Submit'}
      </button>
    </div>
  )
}

