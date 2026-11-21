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
    <nav className="sticky top-0 z-40" style={{ background: 'rgba(26,0,5,0.80)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,80,100,0.12)', boxShadow: '0 4px 24px rgba(180,0,30,0.5)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-glow" style={{ color: '#ffb0b8' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #e8203a, #9a0f22)', boxShadow: '0 2px 12px rgba(220,20,50,0.6)' }}>
            <Music size={16} />
          </div>
          <span>ChoirApp</span>
        </Link>

        {user && (
          <div className="flex items-center gap-1 flex-wrap">
            <span className="hidden sm:block text-xs px-2 py-1 rounded-full mr-2" style={{ background: 'rgba(220,20,50,0.2)', border: '1px solid rgba(255,80,100,0.3)', color: '#ffb0b8' }}>
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

