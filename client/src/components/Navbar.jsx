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
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Music size={22} />
          <span>ChoirApp</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm opacity-80">
              {user.voicePart} · {user.role === 'admin' ? '🛡 Admin' : user.role === 'part_leader' ? '🎤 Leader' : '🎵 Member'}
            </span>

            {user.role === 'member' || user.role === 'part_leader' ? (
              <Link to="/dashboard" className="text-sm hover:underline flex items-center gap-1">
                <Mic size={15} /> Dashboard
              </Link>
            ) : null}

            {(user.role === 'part_leader' || user.role === 'admin') && (
              <Link to="/review" className="text-sm hover:underline flex items-center gap-1">
                <ClipboardList size={15} /> Review
              </Link>
            )}

            <Link to="/roster" className="text-sm hover:underline flex items-center gap-1">
              <Users size={15} /> Approved Songs
            </Link>

            <Link to="/history" className="text-sm hover:underline flex items-center gap-1">
              <History size={15} /> History
            </Link>

            {user.role === 'admin' && (
              <Link to="/admin" className="text-sm hover:underline flex items-center gap-1">
                <Shield size={15} /> Admin
              </Link>
            )}

            <button onClick={handleLogout} className="text-sm hover:underline flex items-center gap-1 opacity-80">
              <LogOut size={15} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
