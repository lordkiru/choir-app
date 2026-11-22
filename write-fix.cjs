const fs = require('fs')

const files = [
  'c:/Projects/choir-app/client/src/pages/MemberDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/LeaderDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/AdminDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/FinalRoster.jsx',
  'c:/Projects/choir-app/client/src/pages/HistoryPage.jsx',
  'c:/Projects/choir-app/client/src/components/RosterExporter.jsx',
]

const fixes = [
  // Fix broken animate-pulse
  ['animate-pulse" style={{ color:"rgba(160,30,50,0.6)"">',  'animate-pulse" style={{ color:"rgba(160,30,50,0.6)" }}>'],
  ['text-center" style={{ color:"rgba(160,30,50,0.4)"">',    'text-center" style={{ color:"rgba(160,30,50,0.4)" }}>'],
  // Fix broken font-bold
  ['font-bold" style={{ color: "#1a0005" }}//class', 'font-bold'],
  ['font-bold text-glow" style={{ color: "#9a0f22" }}//class', 'font-bold text-glow" style={{ color: "#9a0f22" }}'],
  ['font-semibold" style={{ color:"#c0152c"">',  'font-semibold" style={{ color:"#c0152c" }}>'],
  ['font-bold" style={{ color:"#9a0f22"">',      'font-bold" style={{ color:"#9a0f22" }}>'],
  // Fix broken border items
  ['rounded-xl" style={{ border:"1px solid rgba(220,30,60,0.1)"">',  'rounded-xl" style={{ border:"1px solid rgba(220,30,60,0.1)" }}>'],
  // Fix broken tab buttons
  ["'btn-glass border-0'", "'btn-glass text-sm py-1.5 px-4'"],
  ["'btn-glass-outline border-0 py-1.5 px-4'", "'btn-glass-outline text-sm py-1.5 px-4'"],
  // Fix broken amber number badge
  ['className="btn-glass rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs font-bold border-0 //', 'className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(160deg,#e8203a,#9a0f22)" }}//'],
  // Fix broken font-bold text-glow lines (double style)
  ['" style={{ color: "#9a0f22" }}// style={{ color: "#9a0f22" }}', '" style={{ color: "#9a0f22" }}'],
  // Fix stray //class
  ['//class', ''],
  // Fix double ">
  ['"">', '">'],
]

files.forEach((f) => {
  if (!fs.existsSync(f)) return
  let t = fs.readFileSync(f, 'utf8')
  fixes.forEach(([from, to]) => { t = t.split(from).join(to) })
  fs.writeFileSync(f, t, 'utf8')
  console.log('fixed:', f.split('/').pop())
})
