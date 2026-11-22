import { useEffect, useState } from 'react'
import { getActiveSongs, getSubmissionsForReview, reviewSubmission } from '../api'
import ReviewCard from '../components/ReviewCard'
import { ClipboardList } from 'lucide-react'

export default function LeaderDashboard() {
  const [songs, setSongs] = useState([])
  const [activeSongId, setActiveSongId] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getActiveSongs()
      .then(({ data }) => {
        setSongs(data.songs)
        if (data.songs.length > 0) setActiveSongId(data.songs[0]._id)
      })
      .catch(() => setError('Failed to load songs.'))
  }, [])

  useEffect(() => {
    if (!activeSongId) return
    setLoading(true)
    getSubmissionsForReview(activeSongId)
      .then(({ data }) => setSubmissions(data.submissions))
      .catch(() => setError('Failed to load submissions.'))
      .finally(() => setLoading(false))
  }, [activeSongId])

  async function handleReview(id, payload) {
    await reviewSubmission(id, payload)
    // Refresh list
    const { data } = await getSubmissionsForReview(activeSongId)
    setSubmissions(data.submissions)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList size={28} style={{ color: "var(--text-accent)" }} />
        <h1 className="text-2xl font-bold text-glow" style={{ color: "var(--text-heading)" }}>Review Submissions</h1>
      </div>

      {error && <p className="text-red-600 bg-red-50 rounded-xl p-4 mb-4">{error}</p>}

      {/* Song tabs */}
      {songs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {songs.map((s) => (
            <button key={s._id} onClick={() => setActiveSongId(s._id)}
              className={activeSongId === s._id ? 'btn-glass text-sm py-1.5 px-4' : 'btn-glass-outline text-sm py-1.5 px-4'}>
              {s.title}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="animate-pulse" style={{ color:"var(--text-muted)" }}>Loading submissions…</p>}

      {!loading && submissions.length === 0 && (
        <p className="text-center py-10" style={{ color: 'var(--text-faint)' }}>No pending submissions for your voice part on this song.</p>
      )}

      <div className="grid gap-4">
        {submissions.map((sub) => (
          <ReviewCard key={sub._id} submission={sub} onReview={handleReview} />
        ))}
      </div>
    </div>
  )
}
