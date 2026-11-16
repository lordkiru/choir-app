import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'

export default function RosterExporter({ weekLabel, bySong, fullyCleared }) {
  const [copied, setCopied] = useState(false)

  function buildWhatsAppText() {
    const lines = []
    lines.push(`🎵 *CHOIR REHEARSAL APPROVALS*`)
    lines.push(`📅 ${weekLabel}`)
    lines.push('')

    bySong.forEach((group) => {
      lines.push(`🎼 *${group.songTitle}*`)
      if (group.members.length === 0) {
        lines.push('  _No approvals yet_')
      } else {
        group.members.forEach((m) => {
          lines.push(`  ✅ ${m.name} (${m.voicePart})`)
        })
      }
      lines.push('')
    })

    if (fullyCleared.length > 0) {
      lines.push(`🌟 *FULLY CLEARED MEMBERS (All Songs Passed)*`)
      fullyCleared.forEach((m) => lines.push(`  🏆 ${m.name} — ${m.voicePart}`))
    } else {
      lines.push(`🌟 *FULLY CLEARED MEMBERS*`)
      lines.push('  _None yet — keep going!_')
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
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-6">
      {/* Per-song tables */}
      {bySong.map((group) => (
        <div key={group.songTitle}>
          <h3 className="font-bold text-gray-800 mb-2">🎼 {group.songTitle}</h3>
          {group.members.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No approvals yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {group.members.map((m, i) => (
                <li key={i} className="py-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">{m.name}</span>
                  <span className="text-indigo-600 font-semibold">{m.voicePart}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Fully Cleared box */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h3 className="font-bold text-green-800 mb-2">🌟 Fully Cleared Members (All Songs Passed)</h3>
        {fullyCleared.length === 0 ? (
          <p className="text-sm text-green-600 italic">None yet — keep going!</p>
        ) : (
          <ul className="divide-y divide-green-100">
            {fullyCleared.map((m, i) => (
              <li key={i} className="py-2 flex items-center justify-between text-sm">
                <span className="font-bold text-green-900">🏆 {m.name}</span>
                <span className="text-green-700">{m.voicePart}</span>
              </li>
            ))}
          </ul>
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
