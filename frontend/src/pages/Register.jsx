import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, GraduationCap, Building2 } from 'lucide-react'
import PublicNavbar from '../components/layout/PublicNavbar'
import Alert from '../components/ui/Alert'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: 'STUDENT' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.role === 'TPO' ? '/tpo/dashboard' : '/student/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <div className="max-w-md mx-auto px-5 pt-16 pb-24">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold text-ink">Create your account</h1>
          <p className="text-slate mt-2">Join the placement pipeline in under a minute.</p>
        </div>

        <div className="bg-card border border-line rounded-2xl p-7">
          <Alert type="error">{error}</Alert>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              { value: 'STUDENT', label: 'Student', icon: GraduationCap },
              { value: 'TPO', label: 'TPO Admin', icon: Building2 },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, role: value })}
                className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-colors ${
                  form.role === value ? 'border-gold bg-gold-light/25 text-ink' : 'border-line text-slate'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-semibold">{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink">Full name</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="mt-1.5 w-full px-3.5 py-2.5 border border-line rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                placeholder="Jordan Lee"
              />
            </div>
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
              <label className="text-sm font-medium text-ink">Phone (optional)</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1.5 w-full px-3.5 py-2.5 border border-line rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1.5 w-full px-3.5 py-2.5 border border-line rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ink text-paper font-semibold py-2.5 rounded-lg hover:bg-ink-light transition-colors disabled:opacity-60"
            >
              <UserPlus size={17} /> {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-ink font-semibold hover:text-gold">
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  )
}
