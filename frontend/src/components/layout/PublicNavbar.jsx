import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function PublicNavbar() {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center">
            <GraduationCap size={19} className="text-gold" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold text-ink">Centralized Placement Portal</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5 rounded-lg transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold bg-ink text-paper rounded-lg hover:bg-ink-light transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  )
}
