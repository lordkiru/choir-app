import { useEffect, useState } from 'react'
import { getActiveSongs, getMySubmissions, submitRecording } from '../api'
import SongCard from '../components/SongCard'
import AudioRecorder from '../components/AudioRecorder'
import { Music2 } from 'lucide-react'

export default function MemberDashboard() {
  const [songs, setSongs] = useState([])
  const [submissionMap, setSubmissionMap] = useState({}) // songId -> submission
  const [activeSong, setActiveSong] = useState(null) // song currently open in recorder
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const [songsRes, subsRes] = await Promise.all([getActiveSongs(), getMySubmissions()])
      setSongs(songsRes.data.songs)
      const map = {}
      subsRes.data.submissions.forEach((s) => { map[String(s.song._id || s.song)] = s })
      setSubmissionMap(map)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load songs.')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(blob, songId) {
    const fd = new FormData()
    fd.append('audio', blob, 'recording.webm')
    fd.append('songId', songId)
    await submitRecording(fd)
    setActiveSong(null)
    await load() // refresh status
  }

  if (loading) return <div className="p-8 text-center animate-pulse" style={{ color:"rgba(160,30,50,0.6)" }}>Loading songs…</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Music2 size={28} style={{ color: "#c0152c" }} />
        <h1 className="text-2xl font-bold text-glow" style={{ color: "#9a0f22" }}>This Week's Songs</h1>
      </div>

      {error && <p className="text-red-600 bg-red-50 rounded-xl p-4 mb-4">{error}</p>}

      {songs.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <Music2 size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No active songs this week yet.</p>
          <p className="text-sm mt-1">Check back soon or ask your director.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {songs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              submission={submissionMap[String(song._id)]}
              onRecord={() => setActiveSong(song)}
            />
          ))}
        </div>
      )}

      {activeSong && (
        <AudioRecorder
          song={activeSong}
          onSubmit={handleSubmit}
          onClose={() => setActiveSong(null)}
        />
      )}
    </div>
  )
}
