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
    bySong.forEach((g) => {
      lines.push('🎼 *' + g.songTitle + '*')
      if (g.members.length === 0) { lines.push('  _No approvals yet_') }
      else { g.members.forEach((m) => lines.push('  ✅ ' + m.name + ' (' + m.voicePart + ')')) }
      lines.push('')
    })
    lines.push('🏆 *QUALIFIED MEMBERS THIS WEEK*')
    lines.push('_(All ' + totalSongs + ' song' + (totalSongs === 1 ? '' : 's') + ' passed)_')
    lines.push('')
    if (qualifiedMembers.length === 0) { lines.push('  _None yet — keep going!_') }
    else { qualifiedMembers.forEach((m, i) => lines.push('  ' + (i + 1) + '. ' + m.name + ' — ' + m.voicePart)) }
    return lines.join('\n')
  }

  async function handleCopy() {
    try { await navigator.clipboard.writeText(buildWhatsAppText()); setCopied(true); setTimeout(() => setCopied(false), 3000) }
    catch { alert('Could not copy. Please copy manually.') }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="glass p-6 flex flex-col gap-5">
        <h2 className="text-lg font-bold border-b pb-2" style={{ color: 'var(--text-heading)', borderColor: 'rgba(220,30,60,0.12)' }}>🎼 Approved Songs List</h2>
        {bySong.length === 0 ? <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No song approvals yet this week.</p> : (
          bySong.map((group) => (
            <div key={group.songTitle}>
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-heading)' }}>{group.songTitle}</p>
              {group.members.length === 0 ? <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No approvals yet.</p> : (
                <ul className="divide-y" style={{ borderColor: 'rgba(220,30,60,0.08)' }}>
                  {group.members.map((m, i) => (
                    <li key={i} className="py-2 flex items-center justify-between text-sm">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>✅ {m.name}</span>
                      <span className="font-semibold" style={{ color: 'var(--text-accent)' }}>{m.voicePart}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
      <div className="glass p-6" style={{ border: '2px solid rgba(220,170,0,0.28)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} style={{ color: '#b45309' }} />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Qualified Members This Week</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Submitted and approved in all {totalSongs} song{totalSongs === 1 ? '' : 's'}.</p>
        {qualifiedMembers.length === 0 ? <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No one fully qualified yet — keep recording!</p> : (
          <ol className="flex flex-col gap-2">{qualifiedMembers.map((m, i) => (
            <li key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5" style={{ boxShadow: '0 2px 8px rgba(220,170,0,0.1)', border: '1px solid rgba(220,170,0,0.15)' }}>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(160deg,#f59e0b,#d97706)' }}>{i + 1}</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{m.name}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-accent)' }}>{m.voicePart}</span>
            </li>
          ))}</ol>
        )}
      </div>
      <button onClick={handleCopy} className="btn-glass-green w-full text-sm py-3 flex items-center justify-center gap-2">
        {copied ? <><CheckCheck size={18}/> Copied!</> : <><Copy size={18}/> 📱 Copy for WhatsApp</>}
      </button>
    </div>
  )
}