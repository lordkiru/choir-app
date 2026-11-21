import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../contexts/AuthContext'
import { Music, Mail, Lock } from 'lucide-react'

export default function Login() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      const { data } = await login(form)
      loginUser(data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.')
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass w-full max-w-sm p-8 flex flex-col gap-6">
        {/* Logo */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(99,102,241,0.9))', boxShadow: '0 8px 32px rgba(139,92,246,0.5), inset 0 1px 0 rgba(255,255,255,0.3)' }}>
            <Music size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-glow" style={{ color: '#e2d9f3' }}>Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Sign in to ChoirApp</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <Mail size={12} /> Email
            </label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-glass" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <Lock size={12} /> Password
            </label>
            <input type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-glass" placeholder="••••••••" />
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={busy} className="btn-glass w-full text-sm py-3 mt-1">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          No account?{' '}
          <Link to="/register" className="font-semibold hover:underline" style={{ color: '#c4b5fd' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}

