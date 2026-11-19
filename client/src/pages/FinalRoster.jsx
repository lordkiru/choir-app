import { useEffect, useState } from 'react'
import { getFinalList } from '../api'
import RosterExporter from '../components/RosterExporter'
import { Users } from 'lucide-react'

export default function FinalRoster() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getFinalList()
      .then(({ data }) => setData(data))
      .catch(() => setError('Failed to load approved songs list.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading approved songs list…</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Users size={28} className="text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approved Songs List</h1>
          <p className="text-sm text-gray-500">{data.weekLabel}</p>
        </div>
      </div>

      {data.bySong.length === 0 && data.qualifiedMembers.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No approvals recorded yet this week.</p>
      ) : (
        <RosterExporter
          weekLabel={data.weekLabel}
          bySong={data.bySong}
          qualifiedMembers={data.qualifiedMembers}
          totalSongs={data.totalSongs}
        />
      )}
    </div>
  )
}

