import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import PublicNavbar from '../components/layout/PublicNavbar'
import Alert from '../components/ui/Alert'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'TPO' ? '/tpo/dashboard' : '/student/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    if (role === 'TPO') setForm({ email: 'tpo@cpp.edu', password: 'Tpo@1234' })
    else setForm({ email: 'rahul@cpp.edu', password: 'Student@123' })
  }

  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <div className="max-w-md mx-auto px-5 pt-16 pb-24">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold text-ink">Welcome back</h1>
          <p className="text-slate mt-2">Log in to continue to your placement dashboard.</p>
        </div>

        <div className="bg-card border border-line rounded-2xl p-7">
          <Alert type="error">{error}</Alert>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5 w-full px-3.5 py-2.5 border border-line rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                placeholder="you@cpp.edu"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1.5 w-full px-3.5 py-2.5 border border-line rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ink text-paper font-semibold py-2.5 rounded-lg hover:bg-ink-light transition-colors disabled:opacity-60"
            >
              <LogIn size={17} /> {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-line">
            <p className="text-xs text-slate text-center mb-3">Try it instantly with demo data</p>
            <div className="flex gap-2">
              <button
                onClick={() => fillDemo('STUDENT')}
                className="flex-1 text-xs font-mono py-2 rounded-lg border border-line hover:border-teal hover:text-teal transition-colors"
              >
                Demo Student
              </button>
              <button
                onClick={() => fillDemo('TPO')}
                className="flex-1 text-xs font-mono py-2 rounded-lg border border-line hover:border-gold hover:text-gold transition-colors"
              >
                Demo TPO
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate mt-6">
          New here?{' '}
          <Link to="/register" className="text-ink font-semibold hover:text-gold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
