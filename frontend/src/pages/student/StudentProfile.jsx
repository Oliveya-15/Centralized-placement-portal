import { useEffect, useState } from 'react'
import { Save, User2, Link as LinkIcon } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { getMyProfile, updateMyProfile } from '../../api/students'

const emptyForm = {
  rollNumber: '', branch: '', batchYear: '', cgpa: '', activeBacklogs: 0,
  skills: '', resumeLink: '', bio: '',
}

export default function StudentProfile() {
  const [form, setForm] = useState(emptyForm)
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setMeta(data)
        setForm({
          rollNumber: data.rollNumber || '',
          branch: data.branch || '',
          batchYear: data.batchYear || '',
          cgpa: data.cgpa ?? '',
          activeBacklogs: data.activeBacklogs ?? 0,
          skills: data.skills || '',
          resumeLink: data.resumeLink || '',
          bio: data.bio || '',
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const payload = {
        ...form,
        batchYear: form.batchYear ? Number(form.batchYear) : null,
        cgpa: form.cgpa !== '' ? Number(form.cgpa) : null,
        activeBacklogs: Number(form.activeBacklogs || 0),
      }
      const updated = await updateMyProfile(payload)
      setMeta(updated)
      setMessage({ type: 'success', text: 'Profile updated — your live placement profile is current.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not save profile.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout title="My Profile"><Spinner /></DashboardLayout>

  return (
    <DashboardLayout title="My Profile" subtitle="Logged in once, this powers your resume, eligibility checks and AI fit scores.">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-card border border-line rounded-2xl p-6 h-fit">
          <div className="w-14 h-14 rounded-full bg-ink text-gold-light flex items-center justify-center font-display text-xl font-semibold mb-4">
            {meta?.fullName?.[0]}
          </div>
          <h3 className="font-display text-lg font-semibold text-ink">{meta?.fullName}</h3>
          <p className="text-sm text-slate">{meta?.email}</p>
          {meta?.assignedTpoName && (
            <div className="mt-4 pt-4 border-t border-line text-sm">
              <p className="text-slate">Assigned TPO Professor</p>
              <p className="font-semibold text-ink mt-0.5">{meta.assignedTpoName}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-card border border-line rounded-2xl p-6">
          <Alert type={message.type}>{message.text}</Alert>

          <div className="flex items-center gap-2 mb-5">
            <User2 size={18} className="text-gold" />
            <h3 className="font-display text-lg font-semibold text-ink">Academic & Placement Details</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Roll Number">
              <input className="input" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} placeholder="CSE2026001" />
            </Field>
            <Field label="Branch">
              <input className="input" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} placeholder="CSE" />
            </Field>
            <Field label="Batch Year">
              <input type="number" className="input" value={form.batchYear} onChange={(e) => setForm({ ...form, batchYear: e.target.value })} placeholder="2026" />
            </Field>
            <Field label="CGPA">
              <input type="number" step="0.01" min="0" max="10" className="input" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} placeholder="8.5" />
            </Field>
            <Field label="Active Backlogs">
              <input type="number" min="0" className="input" value={form.activeBacklogs} onChange={(e) => setForm({ ...form, activeBacklogs: e.target.value })} />
            </Field>
            <Field label="Resume Link">
              <div className="relative">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                <input className="input pl-8" value={form.resumeLink} onChange={(e) => setForm({ ...form, resumeLink: e.target.value })} placeholder="https://drive.google.com/..." />
              </div>
            </Field>
          </div>

          <Field label="Skills (comma separated)" className="mt-4">
            <input className="input" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Java, React, SQL, Git" />
          </Field>

          <Field label="Short Bio" className="mt-4">
            <textarea rows={3} className="input resize-none" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A short summary TPOs and recruiters will see." />
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 bg-ink text-paper font-semibold px-5 py-2.5 rounded-lg hover:bg-ink-light transition-colors disabled:opacity-60"
          >
            <Save size={17} /> {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>

    </DashboardLayout>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-ink block mb-1.5">{label}</label>
      {children}
    </div>
  )
}
