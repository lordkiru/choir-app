import { useState } from 'react'
import { Copy, CheckCheck, Trophy } from 'lucide-react'

export default function RosterExporter({ weekLabel, bySong, qualifiedMembers, totalSongs }) {
  const [copied, setCopied] = useState(false)

  function buildWhatsAppText() {
    const lines = []
    lines.push('🎵 *CHOIR REHEARSAL APPROVALS*')
    lines.push('📅 ' + weekLabel)
    lines.push('')
    lines.push('🎼 *APPROVED SONGS LIST*')
    lines.push('')

    bySong.forEach((group) => {
      lines.push('🎼 *' + group.songTitle + '*')
      if (group.members.length === 0) {
        lines.push('  _No approvals yet_')
      } else {
        group.members.forEach((m) => lines.push('  ✅ ' + m.name + ' (' + m.voicePart + ')'))
      }
      lines.push('')
    })

    lines.push('🏆 *QUALIFIED MEMBERS THIS WEEK*')
    lines.push('_(Submitted & approved in all ' + totalSongs + ' song' + (totalSongs === 1 ? '' : 's') + ')_')
    lines.push('')
    if (qualifiedMembers.length === 0) {
      lines.push('  _None yet — keep going!_')
    } else {
      qualifiedMembers.forEach((m, i) => lines.push('  ' + (i + 1) + '. ' + m.name + ' — ' + m.voicePart))
    }

    return lines.join('\n')
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildWhatsAppText())
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      alert('Could not copy. Please copy the text manually.')
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Per-song approved lists */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
        <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-2">🎼 Approved Songs List</h2>
        {bySong.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No song approvals yet this week.</p>
        ) : (
          bySong.map((group) => (
            <div key={group.songTitle}>
              <p className="text-sm font-bold text-indigo-700 mb-1">{group.songTitle}</p>
              {group.members.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No approvals yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {group.members.map((m, i) => (
                    <li key={i} className="py-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800">✅ {m.name}</span>
                      <span className="text-indigo-600 font-semibold">{m.voicePart}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>

      {/* Qualified Members box */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={22} className="text-amber-600" />
          <h2 className="text-lg font-extrabold text-amber-800">Qualified Members This Week</h2>
        </div>
        <p className="text-xs text-amber-700 mb-4">
          Submitted and approved in all {totalSongs} song{totalSongs === 1 ? '' : 's'} for this week.
        </p>
        {qualifiedMembers.length === 0 ? (
          <p className="text-sm text-amber-600 italic">No one is fully qualified yet — keep recording!</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {qualifiedMembers.map((m, i) => (
              <li key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="font-bold text-gray-900">{m.name}</span>
                </div>
                <span className="text-sm font-semibold text-indigo-600">{m.voicePart}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* WhatsApp copy button */}
      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition text-sm"
      >
        {copied ? <><CheckCheck size={18} /> Copied!</> : <><Copy size={18} /> 📱 Copy for WhatsApp</>}
      </button>
    </div>
  )
}

