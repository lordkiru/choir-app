import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

const STATUS = {
  pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800', Icon: Clock },
  approved: { label: 'Approved ✅', color: 'bg-green-100 text-green-800', Icon: CheckCircle },
  revision_requested: { label: 'Revision Requested', color: 'bg-red-100 text-red-800', Icon: AlertCircle },
}

export default function SongCard({ song, submission, onRecord }) {
  const s = submission ? STATUS[submission.status] : null

  return (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{song.title}</h2>
        {song.composer && <p className="text-sm text-gray-500">by {song.composer}</p>}
        {song.weekLabel && <p className="text-xs text-indigo-500 mt-1">{song.weekLabel}</p>}
      </div>

      {s && (
        <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full w-fit ${s.color}`}>
          <s.Icon size={15} />
          {s.label}
        </div>
      )}

      {submission?.status === 'revision_requested' && submission.leaderFeedback && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          <span className="font-semibold">Leader feedback: </span>
          {submission.leaderFeedback}
        </div>
      )}

      <button
        onClick={() => onRecord(song)}
        className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition"
      >
        {submission ? 'Re-record & Submit' : 'Record & Submit'}
      </button>
    </div>
  )
}
