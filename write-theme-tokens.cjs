const fs = require('fs')

const files = [
  'c:/Projects/choir-app/client/src/pages/MemberDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/LeaderDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/AdminDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/FinalRoster.jsx',
  'c:/Projects/choir-app/client/src/pages/HistoryPage.jsx',
  'c:/Projects/choir-app/client/src/pages/Login.jsx',
  'c:/Projects/choir-app/client/src/pages/Register.jsx',
  'c:/Projects/choir-app/client/src/components/Navbar.jsx',
  'c:/Projects/choir-app/client/src/components/SongCard.jsx',
  'c:/Projects/choir-app/client/src/components/ReviewCard.jsx',
  'c:/Projects/choir-app/client/src/components/RosterExporter.jsx',
  'c:/Projects/choir-app/client/src/components/AudioRecorder.jsx',
]

// Map hardcoded values -> CSS variable
const swaps = [
  // primary text
  ["color: '#1a0005'",           "color: 'var(--text-primary)'"],
  ['color: "#1a0005"',           'color: "var(--text-primary)"'],
  // headings / strong red
  ["color: '#9a0f22'",           "color: 'var(--text-heading)'"],
  ['color: "#9a0f22"',           'color: "var(--text-heading)"'],
  // accent / link red
  ["color: '#c0152c'",           "color: 'var(--text-accent)'"],
  ['color: "#c0152c"',           'color: "var(--text-accent)"'],
  // muted text
  ["color: 'rgba(160,30,50,0.6)'",  "color: 'var(--text-muted)'"],
  ["color: 'rgba(160,30,50,0.55)'", "color: 'var(--text-muted)'"],
  ["color: 'rgba(160,30,50,0.5)'",  "color: 'var(--text-muted)'"],
  ['color: "rgba(160,30,50,0.6)"',  'color: "var(--text-muted)"'],
  ['color: "rgba(160,30,50,0.55)"', 'color: "var(--text-muted)"'],
  ['color: "rgba(160,30,50,0.5)"',  'color: "var(--text-muted)"'],
  // faint / placeholder-like text
  ["color: 'rgba(160,30,50,0.4)'",  "color: 'var(--text-faint)'"],
  ["color: 'rgba(160,30,50,0.45)'", "color: 'var(--text-faint)'"],
  ['color: "rgba(160,30,50,0.4)"',  'color: "var(--text-faint)"'],
  // label / form label red
  ["color: '#78350f'",           "color: 'var(--text-heading)'"],  // amber on light is fine, but on dark needs to be visible
  // dark red muted combos used in some pages
  ["color: 'rgba(154,15,34,0.75)'", "color: 'var(--text-muted)'"],
  ["color: 'rgba(154,15,34,0.8)'",  "color: 'var(--text-muted)'"],
  // border-soft & bg-soft in inline styles
  ["border: '1px solid rgba(220,30,60,0.1)'",    "border: '1px solid var(--border-soft)'"],
  ["border: '1px solid rgba(220,30,60,0.12)'",   "border: '1px solid var(--border-soft)'"],
  ["border: '1px solid rgba(220,30,60,0.15)'",   "border: '1px solid var(--border-soft)'"],
  ["background: 'rgba(220,30,60,0.06)'",         "background: 'var(--bg-soft)'"],
  ["background: 'rgba(220,30,60,0.08)'",         "background: 'var(--bg-soft)'"],
]

files.forEach((f) => {
  if (!fs.existsSync(f)) { console.log('MISSING:', f); return }
  let t = fs.readFileSync(f, 'utf8')
  swaps.forEach(([from, to]) => { t = t.split(from).join(to) })
  fs.writeFileSync(f, t, 'utf8')
  console.log('patched:', f.split('/').pop())
})
console.log('All done.')
