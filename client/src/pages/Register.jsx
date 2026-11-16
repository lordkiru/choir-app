import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api'
import { useAuth } from '../contexts/AuthContext'
import { Music } from 'lucide-react'

const VOICE_PARTS = ['Soprano', 'Alto', 'Tenor', 'Bass']

export default function Register() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', voicePart: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.voicePart) return setError('Please select your voice part.')
    setBusy(true); setError('')
    try {
      const { data } = await register(form)
      loginUser(data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.')
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col gap-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-2xl mb-3">
            <Music size={28} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join ChoirApp</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[{ label: 'Full name', key: 'name', type: 'text', placeholder: 'Jane Doe' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' }
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} required value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder={placeholder} />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voice part</label>
            <select value={form.voicePart} onChange={(e) => setForm({ ...form, voicePart: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
              <option value="">Select your part…</option>
              {VOICE_PARTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={busy}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition">
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
