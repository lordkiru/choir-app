const fs = require('fs')

// Files to patch
const files = [
  'c:/Projects/choir-app/client/src/pages/MemberDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/LeaderDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/AdminDashboard.jsx',
  'c:/Projects/choir-app/client/src/pages/FinalRoster.jsx',
  'c:/Projects/choir-app/client/src/pages/HistoryPage.jsx',
  'c:/Projects/choir-app/client/src/components/RosterExporter.jsx',
  'c:/Projects/choir-app/client/src/components/AudioRecorder.jsx',
  'c:/Projects/choir-app/client/src/components/SongCard.jsx',
  'c:/Projects/choir-app/client/src/components/ReviewCard.jsx',
]

const replacements = [
  // Old Tailwind grey/indigo/white bg cards → glass
  ['className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5"', 'className="glass p-6 flex flex-col gap-5"'],
  ['className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4"', 'className="glass p-6 flex flex-col gap-4"'],
  ['className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3"', 'className="glass p-6 flex flex-col gap-3"'],
  ['className="bg-white rounded-2xl shadow p-6 flex flex-col gap-6"', 'className="glass p-6 flex flex-col gap-6"'],
  ['className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3"', 'className="glass p-5 flex flex-col gap-3"'],
  ['className="bg-white rounded-2xl shadow p-5 flex flex-col gap-4"', 'className="glass p-5 flex flex-col gap-4"'],
  ['className="bg-white rounded-2xl shadow p-4"', 'className="glass p-4"'],
  ['className="bg-white rounded-2xl shadow overflow-hidden"', 'className="glass overflow-hidden"'],
  // text colours
  ['className="text-2xl font-bold text-gray-900"', 'className="text-2xl font-bold text-glow" style={{ color: "#9a0f22" }}'],
  ['"text-lg font-bold text-gray-900"', '"text-lg font-bold" style={{ color: "#9a0f22" }}'],
  ['className="font-bold text-gray-900', 'className="font-bold" style={{ color: "#1a0005" }}//'],
  // indigo icons / text
  ['className="text-indigo-600"', 'style={{ color: "#c0152c" }}'],
  ['text-indigo-600 font-semibold', 'font-semibold" style={{ color:"#c0152c"'],
  ['text-indigo-700', 'font-bold" style={{ color:"#9a0f22"'],
  // old standard white bg
  ['className="bg-white rounded-2xl shadow p-6"', 'className="glass p-6"'],
  // loading/empty text
  ['text-gray-500 animate-pulse', 'animate-pulse" style={{ color:"rgba(160,30,50,0.6)"'],
  ['text-gray-400 text-center', 'text-center" style={{ color:"rgba(160,30,50,0.4)"'],
  // border items
  ['border border-gray-100 rounded-xl', 'rounded-xl" style={{ border:"1px solid rgba(220,30,60,0.1)"'],
  // indigo tab active
  ["'bg-indigo-600 text-white border-indigo-600'", "'btn-glass border-0'"],
  ["'border-gray-300 text-gray-700 hover:bg-gray-50'", "'btn-glass-outline border-0 py-1.5 px-4'"],
  // amber qualified box → red tinted
  ['className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6"', 'className="glass p-6" style={{ border:"2px solid rgba(220,170,0,0.3)" }}'],
  ['className="text-amber-600"', 'style={{ color:"#b45309" }}'],
  ['className="text-lg font-extrabold text-amber-800"', 'className="text-lg font-extrabold" style={{ color:"#78350f" }}'],
  ['className="text-xs text-amber-700 mb-4"', 'className="text-xs mb-4" style={{ color:"rgba(120,53,15,0.8)" }}'],
  ['className="text-sm text-amber-600 italic"', 'className="text-sm italic" style={{ color:"rgba(120,53,15,0.7)" }}'],
  ['className="bg-amber-400', 'className="btn-glass rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs font-bold border-0 //'],
  // reset section
  ['className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col gap-3"', 'className="glass p-6 flex flex-col gap-3" style={{ border:"1.5px solid rgba(220,30,60,0.2)" }}'],
  ['className="font-bold text-red-800', 'className="font-bold text-glow" style={{ color:"#9a0f22" }}//'],
  ['className="text-sm text-red-700"', 'className="text-sm" style={{ color:"rgba(154,15,34,0.8)" }}'],
  // green WhatsApp button
  ['className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition text-sm"', 'className="btn-glass-green w-full text-sm py-3"'],
]

files.forEach((f) => {
  if (!require('fs').existsSync(f)) return
  let t = fs.readFileSync(f, 'utf8')
  replacements.forEach(([from, to]) => { t = t.split(from).join(to) })
  fs.writeFileSync(f, t, 'utf8')
  console.log('patched:', f.split('/').pop())
})
