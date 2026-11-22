import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Music, LogOut, Users, Mic, ClipboardList, Shield, History, Sun, Moon } from 'lucide-react'

export default function Navbar() {
  const { user, logoutUser, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40" style={{
      background: 'linear-gradient(160deg, #e8203a 0%, #c0152c 55%, #9a0f22 100%)',
      boxShadow: '0 4px 24px rgba(150,0,20,0.4), inset 0 -1px 0 rgba(255,255,255,0.1)',
    }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.2)' }}>
            <Music size={16} className="text-white" />
          </div>
          <span>ChoirApp</span>
        </Link>

        {user && (
          <div className="flex items-center gap-1 flex-wrap">
            {/* Role badge */}
            <span className="hidden sm:block text-xs px-2 py-1 rounded-full mr-1 font-semibold" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
              {user.voicePart} · {user.role === 'admin' ? '🛡' : user.role === 'part_leader' ? '🎤' : '🎵'} {user.role === 'admin' ? 'Admin' : user.role === 'part_leader' ? 'Leader' : 'Member'}
            </span>

            {(user.role === 'member' || user.role === 'part_leader') && (
              <NavLink to="/dashboard" icon={<Mic size={13} />} label="Dashboard" />
            )}
            {(user.role === 'part_leader' || user.role === 'admin') && (
              <NavLink to="/review" icon={<ClipboardList size={13} />} label="Review" />
            )}
            <NavLink to="/roster" icon={<Users size={13} />} label="Approved" />
            <NavLink to="/history" icon={<History size={13} />} label="History" />
            {user.role === 'admin' && (
              <NavLink to="/admin" icon={<Shield size={13} />} label="Admin" />
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center justify-center w-7 h-7 rounded-lg ml-1 transition"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>

            <button onClick={handleLogout}
              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl transition ml-1"
              style={{ color: 'rgba(255,255,255,0.75)', background: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <LogOut size={13} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ to, icon, label }) {
  return (
    <Link to={to}
      className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl transition"
      style={{ color: 'rgba(255,255,255,0.88)', background: 'transparent' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      {icon} {label}
    </Link>
  )
}


