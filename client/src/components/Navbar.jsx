import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Music, LogOut, Users, Mic, ClipboardList, Shield, History } from 'lucide-react'

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40" style={{ background: 'rgba(15,12,41,0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-glow" style={{ color: '#c4b5fd' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.8), rgba(99,102,241,0.8))', boxShadow: '0 2px 10px rgba(139,92,246,0.5)' }}>
            <Music size={16} />
          </div>
          <span>ChoirApp</span>
        </Link>

        {user && (
          <div className="flex items-center gap-1 flex-wrap">
            <span className="hidden sm:block text-xs px-2 py-1 rounded-full mr-2" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd' }}>
              {user.voicePart} · {user.role === 'admin' ? '🛡' : user.role === 'part_leader' ? '🎤' : '🎵'} {user.role === 'admin' ? 'Admin' : user.role === 'part_leader' ? 'Leader' : 'Member'}
            </span>

            {(user.role === 'member' || user.role === 'part_leader') && (
              <Link to="/dashboard" className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl transition" style={{ color: 'rgba(255,255,255,0.75)' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <Mic size={13} /> Dashboard
              </Link>
            )}

            {(user.role === 'part_leader' || user.role === 'admin') && (
              <Link to="/review" className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl transition" style={{ color: 'rgba(255,255,255,0.75)' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <ClipboardList size={13} /> Review
              </Link>
            )}

            <Link to="/roster" className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl transition" style={{ color: 'rgba(255,255,255,0.75)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <Users size={13} /> Approved
            </Link>

            <Link to="/history" className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl transition" style={{ color: 'rgba(255,255,255,0.75)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <History size={13} /> History
            </Link>

            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl transition" style={{ color: 'rgba(255,255,255,0.75)' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <Shield size={13} /> Admin
              </Link>
            )}

            <button onClick={handleLogout} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl transition" style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <LogOut size={13} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

