import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api'
import { useAuth } from '../contexts/AuthContext'
import { Music } from 'lucide-react'
const VOICE_PARTS = ['Soprano', 'Alto', 'Tenor', 'Bass']
export default function Register() {
  const { loginUser } = useAuth(); const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', voicePart: '' })
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.voicePart) return setError('Please select your voice part.')
    setBusy(true); setError('')
    try { const { data } = await register(form); loginUser(data.token); navigate('/') }
    catch (err) { setError(err.response?.data?.error || 'Registration failed.') }
    finally { setBusy(false) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass w-full max-w-sm p-8 flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(160deg,#e8203a,#9a0f22)', boxShadow: '0 8px 28px rgba(220,20,50,0.4),inset 0 1px 0 rgba(255,180,180,0.4)' }}>
            <Music size={28} className="text-white" />
          </div>
          <div><h1 className="text-2xl font-bold text-glow" style={{ color: '#9a0f22' }}>Join ChoirApp</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(160,30,50,0.6)' }}>Create your account</p></div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {[{label:'Full name',key:'name',type:'text',ph:'Jane Doe'},{label:'Email',key:'email',type:'email',ph:'you@example.com'},{label:'Password',key:'password',type:'password',ph:'••••••••'}].map(({label,key,type,ph})=>(
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: '#9a0f22' }}>{label}</label>
              <input type={type} required value={form[key]} onChange={(e)=>setForm({...form,[key]:e.target.value})} className="input-glass" placeholder={ph} />
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: '#9a0f22' }}>Voice part</label>
            <select value={form.voicePart} onChange={(e)=>setForm({...form,voicePart:e.target.value})} className="input-glass" style={{ cursor:'pointer' }}>
              <option value="">Select your part…</option>
              {VOICE_PARTS.map((p)=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background:'rgba(220,30,60,0.08)',border:'1px solid rgba(220,30,60,0.25)',color:'#9a0f22' }}>{error}</div>}
          <button type="submit" disabled={busy} className="btn-glass w-full text-sm py-3 mt-1">{busy ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p className="text-center text-sm" style={{ color: 'rgba(160,30,50,0.6)' }}>
          Already registered? <Link to="/login" className="font-semibold hover:underline" style={{ color: '#c0152c' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}