import { useEffect, useRef, useState } from 'react'
import { getActiveSongs, createSong, deleteSong, resetWeek, getUsers, updateUserRole, deleteUser } from '../api'
import { Shield, Trash2, Upload, RefreshCw, Music, Paperclip, X, Users, ChevronDown } from 'lucide-react'

const ROLES = ['member', 'part_leader', 'admin']
const ROLE_LABELS = { member: '🎵 Member', part_leader: '🎤 Part Leader', admin: '🛡 Admin' }
const ROLE_COLORS = {
  member: 'bg-gray-100 text-gray-700',
  part_leader: 'bg-indigo-100 text-indigo-700',
  admin: 'bg-amber-100 text-amber-700',
}

export default function AdminDashboard() {
  const [songs, setSongs] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ title: '', composer: '' })
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [resetBusy, setResetBusy] = useState(false)
  const [roleBusy, setRoleBusy] = useState('') // userId being updated
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)

  async function load() {
    const [songsRes, usersRes] = await Promise.all([getActiveSongs(), getUsers()])
    setSongs(songsRes.data.songs)
    setUsers(usersRes.data.users)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.title) return setError('Title is required.')
    setBusy(true); setError(''); setSuccess('')
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('composer', form.composer)
      if (file) fd.append('referenceAudio', file)
      await createSong(fd)
      setForm({ title: '', composer: '' }); setFile(null)
      setSuccess('Song added successfully.')
      await load()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create song.')
    } finally { setBusy(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this song and its reference track?')) return
    try { await deleteSong(id); await load() }
    catch (err) { setError(err.response?.data?.error || 'Delete failed.') }
  }

  async function handleRoleChange(userId, newRole) {
    setRoleBusy(userId); setError(''); setSuccess('')
    try {
      await updateUserRole(userId, newRole)
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u))
      setSuccess('Role updated successfully.')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role.')
    } finally { setRoleBusy('') }
  }

  async function handleDeleteUser(userId, name) {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    setError(''); setSuccess('')
    try {
      await deleteUser(userId)
      setUsers((prev) => prev.filter((u) => u._id !== userId))
      setSuccess(`${name} has been removed.`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user.')
    }
  }

  async function handleReset() {
    if (!window.confirm('⚠️ Reset the week? This will archive songs and delete unapproved recordings. This cannot be undone.')) return
    setResetBusy(true); setError(''); setSuccess('')
    try {
      const { data } = await resetWeek()
      setSuccess(`Week reset complete. ${data.summary.unapprovedDeleted} unapproved deleted, ${data.summary.songsArchived} songs archived.`)
      await load()
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed.')
    } finally { setResetBusy(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Shield size={28} className="text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {error && <p className="text-red-600 bg-red-50 rounded-xl p-4">{error}</p>}
      {success && <p className="text-green-700 bg-green-50 rounded-xl p-4">{success}</p>}

      {/* Add Song */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-bold text-gray-900 flex items-center gap-2"><Music size={18} /> Add Song for This Week</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <input type="text" placeholder="Song title *" required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <input type="text" placeholder="Composer (optional)" value={form.composer}
            onChange={(e) => setForm({ ...form, composer: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />

          {/* Custom file picker button */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Reference audio (optional)</label>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-semibold px-4 py-2 rounded-xl text-sm transition"
              >
                <Paperclip size={15} />
                {file ? 'Change file' : 'Choose audio file'}
              </button>
              {file && (
                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-1.5 text-sm text-indigo-700 flex-1 min-w-0">
                  <Music size={14} className="shrink-0" />
                  <span className="truncate font-medium">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => { setFile(null); fileInputRef.current.value = '' }}
                    className="ml-auto shrink-0 text-indigo-400 hover:text-red-500 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={busy}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition">
            <Upload size={16} /> {busy ? 'Adding…' : 'Add Song'}
          </button>
        </form>
      </div>

      {/* Active songs list */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
        <h2 className="font-bold text-gray-900">Active Songs ({songs.length})</h2>
        {songs.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No active songs yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {songs.map((s) => (
              <li key={s._id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-800">{s.title}</p>
                  {s.composer && <p className="text-xs text-gray-500">{s.composer}</p>}
                </div>
                <button onClick={() => handleDelete(s._id)}
                  className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* User Management */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-bold text-gray-900 flex items-center gap-2"><Users size={18} /> User Management ({users.length})</h2>
        {users.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No users yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {users.map((u) => (
              <li key={u._id} className="flex flex-wrap items-center justify-between gap-3 border border-gray-100 rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email} · {u.voicePart}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Role selector */}
                  <div className="relative">
                    <select
                      value={u.role}
                      disabled={roleBusy === u._id}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${ROLE_COLORS[u.role]}`}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteUser(u._id, u.name)}
                    disabled={roleBusy === u._id}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition disabled:opacity-40"
                    title="Remove user"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Weekly Reset */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col gap-3">
        <h2 className="font-bold text-red-800 flex items-center gap-2"><RefreshCw size={18} /> Weekly Reset</h2>
        <p className="text-sm text-red-700">
          Archives active songs, deletes all unapproved recordings from storage, and strips audio from approved submissions.
          Approval text records (names, parts, song) are preserved permanently.
        </p>
        <button onClick={handleReset} disabled={resetBusy}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition">
          <RefreshCw size={16} /> {resetBusy ? 'Resetting…' : 'Reset This Week'}
        </button>
      </div>
    </div>
  )
}
