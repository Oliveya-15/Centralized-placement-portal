import { useState } from 'react'
import { X } from 'lucide-react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout({ title, subtitle, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 z-50 p-1.5 rounded-md bg-white/10 text-paper"
            >
              <X size={18} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <Topbar title={title} subtitle={subtitle} onMenuClick={() => setMobileOpen(true)} />
        <main className="px-5 lg:px-8 py-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  )
}
