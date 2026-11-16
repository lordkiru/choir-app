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
        <ClipboardList size={28} className="text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Review Submissions</h1>
      </div>

      {error && <p className="text-red-600 bg-red-50 rounded-xl p-4 mb-4">{error}</p>}

      {/* Song tabs */}
      {songs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {songs.map((s) => (
            <button key={s._id} onClick={() => setActiveSongId(s._id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border ${activeSongId === s._id ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              {s.title}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-gray-500 animate-pulse">Loading submissions…</p>}

      {!loading && submissions.length === 0 && (
        <p className="text-gray-400 text-center py-10">No pending submissions for your voice part on this song.</p>
      )}

      <div className="grid gap-4">
        {submissions.map((sub) => (
          <ReviewCard key={sub._id} submission={sub} onReview={handleReview} />
        ))}
      </div>
    </div>
  )
}
