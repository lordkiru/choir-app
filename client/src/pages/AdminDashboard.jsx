import { useEffect, useRef, useState } from 'react'
import { getActiveSongs, createSong, deleteSong, resetWeek, getUsers, updateUserRole, deleteUser } from '../api'
import { Shield, Trash2, Upload, RefreshCw, Music, Paperclip, X, Users, ChevronDown } from 'lucide-react'

const ROLES = ['member', 'part_leader', 'admin']
const ROLE_LABELS = { member: '🎵 Member', part_leader: '🎤 Part Leader', admin: '🛡 Admin' }
const ROLE_COLORS = { member: 'bg-rose-50 text-rose-700', part_leader: 'bg-red-100 text-red-800', admin: 'bg-amber-100 text-amber-800' }

export default function AdminDashboard() {
  const [songs, setSongs] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ title: '', composer: '' })
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [resetBusy, setResetBusy] = useState(false)
  const [roleBusy, setRoleBusy] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)
  const RED = { color: '#9a0f22' }
  const MUTED = { color: 'rgba(160,30,50,0.55)' }
  const DARK = { color: '#1a0005' }
  async function load() {
    try { const [sR,uR]=await Promise.all([getActiveSongs(),getUsers()]); setSongs(sR.data.songs); setUsers(uR.data.users) }
    catch(err){setError(err.response?.data?.error||'Failed to load.')} }
  useEffect(()=>{load()},[]) // eslint-disable-line
  async function handleCreate(e) {
    e.preventDefault(); if(!form.title)return setError('Title required.')
    setBusy(true);setError('');setSuccess('')
    try { const fd=new FormData(); fd.append('title',form.title); fd.append('composer',form.composer); if(file)fd.append('referenceAudio',file); await createSong(fd); setForm({title:'',composer:''}); setFile(null); setSuccess('Song added.'); await load() }
    catch(err){setError(err.response?.data?.error||'Failed.')} finally{setBusy(false)} }
  async function handleDelete(id){if(!window.confirm('Delete this song?'))return; try{await deleteSong(id);await load()}catch(err){setError(err.response?.data?.error||'Failed.')}}
  async function handleRoleChange(uid,role){
    setRoleBusy(uid);setError('');setSuccess('')
    try{await updateUserRole(uid,role);setUsers((p)=>p.map((u)=>u._id===uid?{...u,role}:u));setSuccess('Role updated.')}
    catch(err){setError(err.response?.data?.error||'Failed.')}finally{setRoleBusy('')}}
  async function handleDeleteUser(uid,name){
    if(!window.confirm('Delete "'+name+'"?'))return
    try{await deleteUser(uid);setUsers((p)=>p.filter((u)=>u._id!==uid));setSuccess(name+' removed.')}
    catch(err){setError(err.response?.data?.error||'Failed.')}}
  async function handleReset(){
    if(!window.confirm('Reset the week? Cannot be undone.'))return
    setResetBusy(true);setError('');setSuccess('')
    try{const{data}=await resetWeek();setSuccess('Done. '+data.summary.unapprovedDeleted+' deleted, '+data.summary.songsArchived+' archived.');await load()}
    catch(err){setError(err.response?.data?.error||'Reset failed.')}finally{setResetBusy(false)}}
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Shield size={28} style={{ color:'#c0152c' }} />
        <h1 className="text-2xl font-bold text-glow" style={{ color:'#9a0f22' }}>Admin Dashboard</h1>
      </div>
      {error&&<div className="rounded-xl px-4 py-3 text-sm" style={{background:'rgba(220,30,60,0.08)',border:'1px solid rgba(220,30,60,0.22)',color:'#9a0f22'}}>{error}</div>}
      {success&&<div className="rounded-xl px-4 py-3 text-sm" style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.3)',color:'#14532d'}}>{success}</div>}
      <div className="glass p-6 flex flex-col gap-4">
        <h2 className="font-bold flex items-center gap-2" style={{ color:'#9a0f22' }}><Music size={18}/> Add Song for This Week</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <input type="text" placeholder="Song title *" required value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} className="input-glass" />
          <input type="text" placeholder="Composer (optional)" value={form.composer} onChange={(e)=>setForm({...form,composer:e.target.value})} className="input-glass" />
          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={(e)=>setFile(e.target.files[0]||null)} />
          <div>
            <label className="text-xs font-semibold block mb-2" style={{ color:'#9a0f22' }}>Reference audio (optional)</label>
            <div className="flex items-center gap-3 flex-wrap">
              <button type="button" onClick={()=>fileInputRef.current.click()} className="btn-glass-outline flex items-center gap-2 text-sm py-2"><Paperclip size={13}/>{file?'Change file':'Choose audio file'}</button>
              {file&&<div className="flex items-center gap-2 rounded-xl px-3 py-1.5 flex-1 min-w-0 text-sm" style={{background:'rgba(220,30,60,0.06)',border:'1px solid rgba(220,30,60,0.15)',color:'#9a0f22'}}><Music size={13} className="shrink-0"/><span className="truncate">{file.name}</span><button type="button" onClick={()=>{setFile(null);fileInputRef.current.value=''}} className="ml-auto"><X size={13}/></button></div>}
            </div>
          </div>
          <button type="submit" disabled={busy} className="btn-glass w-full text-sm py-2.5 flex items-center justify-center gap-2"><Upload size={15}/> {busy?'Adding…':'Add Song'}</button>
        </form>
      </div>
      <div className="glass p-6 flex flex-col gap-3">
        <h2 className="font-bold flex items-center gap-2" style={{ color:'#9a0f22' }}><Music size={18}/> Active Songs ({songs.length})</h2>
        {songs.length===0?<p className="text-sm italic" style={{color:'rgba(160,30,50,0.55)'}}>No active songs yet.</p>:(<ul className="flex flex-col gap-2">{songs.map((s)=>(<li key={s._id} className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl" style={{border:'1px solid rgba(220,30,60,0.1)'}}><div><p className="font-semibold text-sm" style={{color:'#1a0005'}}>{s.title}</p>{s.composer&&<p className="text-xs" style={{color:'rgba(160,30,50,0.5)'}}>{s.composer}</p>}</div><button onClick={()=>handleDelete(s._id)} className="p-1.5 rounded-lg" style={{color:'rgba(220,30,60,0.5)'}}><Trash2 size={15}/></button></li>))}</ul>)}
      </div>
      <div className="glass p-6 flex flex-col gap-3">
        <h2 className="font-bold flex items-center gap-2" style={{ color:'#9a0f22' }}><Users size={18}/> User Management ({users.length})</h2>
        {users.length===0?<p className="text-sm italic" style={{color:'rgba(160,30,50,0.55)'}}>No users yet.</p>:(<ul className="flex flex-col gap-2">{users.map((u)=>(<li key={u._id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 rounded-xl" style={{border:'1px solid rgba(220,30,60,0.1)'}}><div className="flex-1 min-w-0"><p className="font-semibold text-sm" style={{color:'#1a0005'}}>{u.name}</p><p className="text-xs" style={{color:'rgba(160,30,50,0.5)'}}>{u.email} · {u.voicePart}</p></div><div className="flex items-center gap-2"><div className="relative"><select value={u.role} disabled={roleBusy===u._id} onChange={(e)=>handleRoleChange(u._id,e.target.value)} className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer ${ROLE_COLORS[u.role]}`}>{ROLES.map((ro)=>(<option key={ro} value={ro}>{ROLE_LABELS[ro]}</option>))}</select><ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"/></div><button onClick={()=>handleDeleteUser(u._id,u.name)} disabled={roleBusy===u._id} className="p-1.5 rounded-lg" style={{color:'rgba(220,30,60,0.5)'}}><Trash2 size={14}/></button></div></li>))}</ul>)}
      </div>
      <div className="glass p-6 flex flex-col gap-3" style={{border:'1.5px solid rgba(220,30,60,0.22)'}}>
        <h2 className="font-bold flex items-center gap-2" style={{ color:'#9a0f22' }}><RefreshCw size={18}/> Weekly Reset</h2>
        <p className="text-sm" style={{color:'rgba(154,15,34,0.75)'}}>Archives active songs and deletes unapproved recordings. Approval records are preserved permanently.</p>
        <button onClick={handleReset} disabled={resetBusy} className="btn-glass-red flex items-center justify-center gap-2 text-sm py-2.5"><RefreshCw size={15}/> {resetBusy?'Resetting…':'Reset This Week'}</button>
      </div>
    </div>
  )
}