const fs = require('fs')
const p = 'c:/Projects/choir-app/client/src/components/Navbar.jsx'
let t = fs.readFileSync(p, 'utf8')
t = t.replaceAll("color: 'rgba(255,255,255,0.75)'", "color: '#7f1d1d'")
t = t.replaceAll("color: 'rgba(255,255,255,0.5)'", "color: '#9f1239'")
t = t.replaceAll("'rgba(255,255,255,0.08)'", "'rgba(220,30,60,0.08)'")
fs.writeFileSync(p, t, 'utf8')
console.log('Navbar colors updated')
