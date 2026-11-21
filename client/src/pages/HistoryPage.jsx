import { useState } from 'react'
import { getHistory } from '../api'
import { Search, Music, Trophy, ChevronDown, ChevronUp, History } from 'lucide-react'

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [weeks, setWeeks] = useState([])
  const [total, setTotal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState({})
  const [searched, setSearched] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true); setError(''); setSearched(true)
    try {
      const params = {}
      if (search.trim()) params.search = search.trim()
      if (from) params.from = from
      if (to) params.to = to
      const { data } = await getHistory(params)
      setWeeks(data.weeks); setTotal(data.total)
      if (data.weeks.length > 0) setExpanded({ [data.weeks[0].weekLabel]: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load history.')
    } finally { setLoading(false) }
  }

  function toggleExpand(label) { setExpanded((prev) => ({ ...prev, [label]: !prev[label] })) }
  function handleClear() { setSearch(''); setFrom(''); setTo(''); setWeeks([]); setTotal(null); setSearched(false); setError('') }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <History size={28} className="text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Song History</h1>
          <p className="text-sm text-gray-500">Search past weeks, songs sung and qualified members</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Song title, member name or week label..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition">
            <Search size={15} /> {loading ? 'Searching...' : 'Search'}
          </button>
          {searched && <button type="button" onClick={handleClear} className="px-5 border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl text-sm transition">Clear</button>}
        </div>
      </form>
      {error && <p className="text-red-600 bg-red-50 rounded-xl p-4 text-sm">{error}</p>}
      {searched && !loading && (
        <div>
          <p className="text-sm text-gray-500 mb-3 font-medium">{total === 0 ? 'No results found.' : total + ' week' + (total === 1 ? '' : 's') + ' found'}</p>
          <div className="flex flex-col gap-3">
            {weeks.map((w) => (
              <div key={w.weekLabel} className="bg-white rounded-2xl shadow overflow-hidden">
                <button type="button" onClick={() => toggleExpand(w.weekLabel)} className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-gray-50 transition">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900">{w.weekLabel}</span>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Music size={12} /> {w.totalSongs} song{w.totalSongs === 1 ? '' : 's'}</span>
                      <span className="flex items-center gap-1"><Trophy size={12} /> {w.qualifiedCount} qualified</span>
                    </div>
                  </div>
                  {expanded[w.weekLabel] ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                {expanded[w.weekLabel] && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 flex flex-col gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Songs</p>
                      <ul className="flex flex-col gap-2">{w.songs.map((s) => (<li key={s.title} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-gray-800"><Music size={13} className="text-indigo-400" />{s.title}</span><span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{s.approvedCount} approved</span></li>))}</ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Qualified Members ({w.qualifiedCount})</p>
                      {w.qualifiedMembers.length === 0 ? <p className="text-sm text-gray-400 italic">No one qualified this week.</p> : (
                        <ol className="flex flex-col gap-1.5">{w.qualifiedMembers.map((m, i) => (<li key={i} className="flex items-center gap-3 text-sm"><span className="w-5 h-5 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span><span className="font-medium text-gray-800">{m.name}</span><span className="text-xs text-indigo-600 font-semibold ml-auto">{m.voicePart}</span></li>))}</ol>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {!searched && (
        <div className="text-center py-12 text-gray-400">
          <History size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Search to view past weeks</p>
          <p className="text-sm mt-1">Leave all fields empty and click Search to see all history</p>
        </div>
      )}
    </div>
  )
}