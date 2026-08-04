import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, UserRound, Briefcase, ClipboardList, MessagesSquare,
  Sparkles, PlusCircle, FolderKanban, Users, Megaphone, GraduationCap,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/profile', label: 'My Profile', icon: UserRound },
  { to: '/student/jobs', label: 'Job Feed', icon: Briefcase },
  { to: '/student/applications', label: 'My Applications', icon: ClipboardList },
  { to: '/student/copilot', label: 'AI Copilot', icon: Sparkles },
  { to: '/student/messages', label: 'Professor Desk', icon: MessagesSquare },
]

const tpoLinks = [
  { to: '/tpo/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tpo/post-job', label: 'Post a Drive', icon: PlusCircle },
  { to: '/tpo/manage-jobs', label: 'Manage Drives', icon: FolderKanban },
  { to: '/tpo/ledger', label: 'Master Ledger', icon: Users },
  { to: '/tpo/broadcast', label: 'Broadcast', icon: Megaphone },
  { to: '/tpo/messages', label: 'Messages', icon: MessagesSquare },
]

export default function Sidebar() {
  const { user } = useAuth()
  const links = user?.role === 'TPO' ? tpoLinks : studentLinks

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-ink text-paper min-h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center shrink-0">
          <GraduationCap size={20} className="text-ink" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="font-display font-semibold text-lg">CPP</p>
          <p className="text-[11px] text-paper/50 tracking-wide">Placement Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold text-ink'
                  : 'text-paper/70 hover:bg-white/5 hover:text-paper'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5 border-t border-white/10 text-xs text-paper/40">
        Centralized Placement Portal
        <br />© {new Date().getFullYear()} — built for your campus
      </div>
    </aside>
  )
}
