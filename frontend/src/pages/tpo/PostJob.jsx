import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Alert from '../../components/ui/Alert'
import { createJob } from '../../api/jobs'

const emptyForm = {
  companyName: '', roleTitle: '', description: '', jobType: 'FULL_TIME', location: '',
  ctcLpa: '', minCgpa: '', maxBacklogs: '', eligibleBranches: '', requiredSkills: '',
  roundsBreakdown: '', applicationDeadline: '',
}

export default function PostJob() {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        ctcLpa: form.ctcLpa !== '' ? Number(form.ctcLpa) : null,
        minCgpa: form.minCgpa !== '' ? Number(form.minCgpa) : null,
        maxBacklogs: form.maxBacklogs !== '' ? Number(form.maxBacklogs) : null,
        applicationDeadline: form.applicationDeadline || null,
      }
      const job = await createJob(payload)
      navigate(`/tpo/manage-jobs`, { state: { justCreated: job.companyName } })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post this drive.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout title="Post a Drive" subtitle="One posting, delivered instantly to every eligible student's feed.">
      <form onSubmit={handleSubmit} className="max-w-3xl bg-card border border-line rounded-2xl p-6 space-y-5">
        <Alert type="error">{error}</Alert>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Company Name" required>
            <input required className="input" value={form.companyName} onChange={set('companyName')} placeholder="Wipro" />
          </Field>
          <Field label="Role Title" required>
            <input required className="input" value={form.roleTitle} onChange={set('roleTitle')} placeholder="Project Engineer" />
          </Field>
        </div>

        <Field label="Job Description">
          <textarea rows={3} className="input resize-none" value={form.description} onChange={set('description')} placeholder="What will the selected candidates do?" />
        </Field>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Job Type">
            <select className="input" value={form.jobType} onChange={set('jobType')}>
              <option value="FULL_TIME">Full-Time</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </Field>
          <Field label="Location">
            <input className="input" value={form.location} onChange={set('location')} placeholder="Bengaluru" />
          </Field>
          <Field label="CTC (LPA)">
            <input type="number" step="0.1" className="input" value={form.ctcLpa} onChange={set('ctcLpa')} placeholder="4.5" />
          </Field>
        </div>

        <div className="pt-4 border-t border-line">
          <p className="text-xs font-mono uppercase tracking-widest text-slate mb-3">Eligibility Criteria</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Minimum CGPA">
              <input type="number" step="0.01" min="0" max="10" className="input" value={form.minCgpa} onChange={set('minCgpa')} placeholder="6.0" />
            </Field>
            <Field label="Max Active Backlogs">
              <input type="number" min="0" className="input" value={form.maxBacklogs} onChange={set('maxBacklogs')} placeholder="1" />
            </Field>
            <Field label="Application Deadline">
              <input type="date" className="input" value={form.applicationDeadline} onChange={set('applicationDeadline')} />
            </Field>
          </div>
          <Field label="Eligible Branches (comma separated, blank = all)" className="mt-4">
            <input className="input" value={form.eligibleBranches} onChange={set('eligibleBranches')} placeholder="CSE, IT, ECE" />
          </Field>
          <Field label="Required Skills (comma separated, powers the AI fit score)" className="mt-4">
            <input className="input" value={form.requiredSkills} onChange={set('requiredSkills')} placeholder="Java, SQL, Problem Solving" />
          </Field>
        </div>

        <Field label="Interview Rounds (use -> to separate rounds, powers the AI Copilot)">
          <input className="input" value={form.roundsBreakdown} onChange={set('roundsBreakdown')} placeholder="Round 1: Aptitude -> Round 2: Technical -> Round 3: HR" />
        </Field>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-ink text-paper font-semibold px-5 py-2.5 rounded-lg hover:bg-ink-light transition-colors disabled:opacity-60"
        >
          <PlusCircle size={17} /> {saving ? 'Publishing…' : 'Publish Drive'}
        </button>
      </form>
    </DashboardLayout>
  )
}

function Field({ label, children, required, className = '' }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-ink block mb-1.5">
        {label} {required && <span className="text-coral">*</span>}
      </label>
      {children}
    </div>
  )
}
