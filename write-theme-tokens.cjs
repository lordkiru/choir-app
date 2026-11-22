const fs = require('fs')

const files = [
  'c:/Projects/choir-app/client/src/pages/MemberDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/LeaderDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/AdminDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/FinalRoster.jsx',
  'c:/Projects/choir-app/client/src/pages/HistoryPage.jsx',
  'c:/Projects/choir-app/client/src/pages/Login.jsx',
  'c:/Projects/choir-app/client/src/pages/Register.jsx',
  'c:/Projects/choir-app/client/src/components/SongCard.jsx',
  'c:/Projects/choir-app/client/src/components/ReviewCard.jsx',
  'c:/Projects/choir-app/client/src/components/RosterExporter.jsx',
  'c:/Projects/choir-app/client/src/components/AudioRecorder.jsx',
]

const swaps = [
  // primary
  ["color:'#1a0005'","color:'var(--text-primary)'"],
  ["color: '#1a0005'","color: 'var(--text-primary)'"],
  ['color:"#1a0005"','color:"var(--text-primary)"'],
  // heading red
  ["color:'#9a0f22'","color:'var(--text-heading)'"],
  ["color: '#9a0f22'","color: 'var(--text-heading)'"],
  ['color:"#9a0f22"','color:"var(--text-heading)"'],
  // accent
  ["color:'#c0152c'","color:'var(--text-accent)'"],
  ["color: '#c0152c'","color: 'var(--text-accent)'"],
  ['color:"#c0152c"','color:"var(--text-accent)"'],
  // light pink (SongCard, ReviewCard)
  ["color: '#ffe8ea'","color: 'var(--text-primary)'"],
  ["color:'#ffe8ea'","color:'var(--text-primary)'"],
  ["color: 'rgba(255,140,160,0.9)'","color: 'var(--text-heading)'"],
  ["color: 'rgba(255,180,180,0.35)'","color: 'var(--text-faint)'"],
  ["color: 'rgba(255,180,180,0.5)'","color: 'var(--text-faint)'"],
  // muted
  ["color:'rgba(160,30,50,0.6)'","color:'var(--text-muted)'"],
  ["color:'rgba(160,30,50,0.55)'","color:'var(--text-muted)'"],
  ["color:'rgba(160,30,50,0.5)'","color:'var(--text-muted)'"],
  ["color:'rgba(154,15,34,0.75)'","color:'var(--text-muted)'"],
  ["color:'rgba(154,15,34,0.8)'","color:'var(--text-muted)'"],
  ["color: 'rgba(160,30,50,0.6)'","color: 'var(--text-muted)'"],
  ["color: 'rgba(160,30,50,0.55)'","color: 'var(--text-muted)'"],
  ["color: 'rgba(160,30,50,0.5)'","color: 'var(--text-muted)'"],
  ["color: 'rgba(160,30,50,0.7)'","color: 'var(--text-muted)'"],
  ["color: 'rgba(154,15,34,0.75)'","color: 'var(--text-muted)'"],
  ["color: 'rgba(154,15,34,0.8)'","color: 'var(--text-muted)'"],
  ['color:"rgba(160,30,50,0.6)"','color:"var(--text-muted)"'],
  ['color:"rgba(160,30,50,0.55)"','color:"var(--text-muted)"'],
  // faint
  ["color:'rgba(160,30,50,0.4)'","color:'var(--text-faint)'"],
  ["color:'rgba(160,30,50,0.45)'","color:'var(--text-faint)'"],
  ["color: 'rgba(160,30,50,0.4)'","color: 'var(--text-faint)'"],
  ["color: 'rgba(160,30,50,0.45)'","color: 'var(--text-faint)'"],
  ['color:"rgba(160,30,50,0.4)"','color:"var(--text-faint)"'],
  // amber / qualified box text
  ["color: '#78350f'","color: 'var(--text-heading)'"],
  ["color: 'rgba(120,53,15,0.65)'","color: 'var(--text-muted)'"],
  ["color: 'rgba(120,53,15,0.75)'","color: 'var(--text-muted)'"],
  ["color: 'rgba(120,53,15,0.8)'","color: 'var(--text-muted)'"],
  // loading spinners using double-quote style
  ['color:"rgba(160,30,50,0.6)"','color:"var(--text-muted)"'],
  // border soft
  ["border:'1px solid rgba(220,30,60,0.1)'","border:'1px solid var(--border-soft)'"],
  ["border:'1px solid rgba(220,30,60,0.15)'","border:'1px solid var(--border-soft)'"],
  ["border: '1px solid rgba(220,30,60,0.1)'","border: '1px solid var(--border-soft)'"],
  ["border: '1px solid rgba(220,30,60,0.12)'","border: '1px solid var(--border-soft)'"],
  ["border: '1px solid rgba(220,30,60,0.15)'","border: '1px solid var(--border-soft)'"],
  // bg soft
  ["background:'rgba(220,30,60,0.06)'","background:'var(--bg-soft)'"],
  ["background:'rgba(220,30,60,0.08)'","background:'var(--bg-soft)'"],
  ["background: 'rgba(220,30,60,0.06)'","background: 'var(--bg-soft)'"],
  ["background: 'rgba(220,30,60,0.08)'","background: 'var(--bg-soft)'"],
  // also any remaining ReviewCard pink text that slipped through
  ["color: 'rgba(255,120,140,0.8)'","color: 'var(--text-heading)'"],
]

files.forEach((f) => {
  if (!fs.existsSync(f)) return
  let t = fs.readFileSync(f, 'utf8')
  swaps.forEach(([from, to]) => { while (t.includes(from)) t = t.split(from).join(to) })
  fs.writeFileSync(f, t, 'utf8')
  console.log('patched:', f.split('/').pop())
})
console.log('Done.')
