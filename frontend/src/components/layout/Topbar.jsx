import { useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.fullName
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-paper/90 backdrop-blur border-b border-line px-5 lg:px-8 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-ink/5">
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-ink truncate">{title}</h1>
          {subtitle && <p className="text-sm text-slate mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm font-semibold text-ink">{user?.fullName}</span>
          <span className="text-xs text-slate">{user?.role === 'TPO' ? 'TPO Administrator' : 'Student'}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-ink text-gold-light flex items-center justify-center font-semibold font-mono">
          {initials}
        </div>
        <button
          onClick={handleLogout}
          title="Log out"
          className="p-2.5 rounded-lg border border-line text-slate hover:text-coral hover:border-coral transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
