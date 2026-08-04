import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Calendar, Briefcase, IndianRupee, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import { getJob } from '../../api/jobs'
import { applyToJob, myApplications } from '../../api/applications'
import { getFitScore } from '../../api/ai'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [fitScore, setFitScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    setLoading(true)
    Promise.all([getJob(id), myApplications(), getFitScore(id).catch(() => null)])
      .then(([jobData, apps, fit]) => {
        setJob(jobData)
        setAlreadyApplied(apps.some((a) => a.jobId === Number(id)))
        setFitScore(fit)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async () => {
    setApplying(true)
    setMessage({ type: '', text: '' })
    try {
      await applyToJob(id)
      setAlreadyApplied(true)
      setMessage({ type: 'success', text: 'Application submitted! Track its status from My Applications.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not submit application.' })
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <DashboardLayout title="Job Details"><Spinner /></DashboardLayout>
  if (!job) return <DashboardLayout title="Job Details"><Alert type="error">Job not found.</Alert></DashboardLayout>

  return (
    <DashboardLayout title={job.companyName} subtitle={job.roleTitle}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-5">
        <ArrowLeft size={15} /> Back to feed
      </button>

      <Alert type={message.type}>{message.text}</Alert>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="pass-card p-6">
            <div className="flex flex-wrap gap-4 text-sm text-slate mb-5">
              <span className="flex items-center gap-1.5"><MapPin size={15} /> {job.location || 'Not specified'}</span>
              <span className="flex items-center gap-1.5"><Briefcase size={15} /> {job.jobType === 'INTERNSHIP' ? 'Internship' : 'Full-Time'}</span>
              <span className="flex items-center gap-1.5"><IndianRupee size={15} /> {job.ctcLpa ? `${job.ctcLpa} LPA` : 'Not disclosed'}</span>
              <span className="flex items-center gap-1.5"><Calendar size={15} /> Deadline {job.applicationDeadline || 'Rolling'}</span>
            </div>

            <h3 className="font-display font-semibold text-ink mb-2">About the role</h3>
            <p className="text-sm text-slate leading-relaxed whitespace-pre-line">{job.description || 'No description provided.'}</p>

            <h3 className="font-display font-semibold text-ink mt-6 mb-2">Eligibility</h3>
            <ul className="text-sm text-slate space-y-1.5">
              <li>• Minimum CGPA: <span className="font-mono text-ink">{job.minCgpa ?? 'No minimum'}</span></li>
              <li>• Max active backlogs: <span className="font-mono text-ink">{job.maxBacklogs ?? 'No limit'}</span></li>
              <li>• Eligible branches: <span className="font-mono text-ink">{job.eligibleBranches || 'All branches'}</span></li>
              <li>• Required skills: <span className="font-mono text-ink">{job.requiredSkills || 'Not specified'}</span></li>
            </ul>

            {job.roundsBreakdown && (
              <>
                <h3 className="font-display font-semibold text-ink mt-6 mb-2">Interview pipeline</h3>
                <div className="flex flex-wrap gap-2">
                  {job.roundsBreakdown.split('->').map((r, i) => (
                    <span key={i} className="text-xs font-mono px-3 py-1.5 rounded-full bg-ink/5 text-ink">{r.trim()}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-card border border-line rounded-2xl p-6 text-center">
            {alreadyApplied ? (
              <div className="text-teal flex flex-col items-center gap-2 py-2">
                <CheckCircle2 size={28} />
                <p className="font-semibold">Application submitted</p>
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying || job.status !== 'OPEN'}
                className="w-full bg-ink text-paper font-semibold py-3 rounded-xl hover:bg-ink-light transition-colors disabled:opacity-60"
              >
                {applying ? 'Submitting…' : job.status === 'OPEN' ? 'Apply Now' : 'Applications Closed'}
              </button>
            )}
            <Link to="/student/copilot" state={{ company: job.companyName }} className="mt-3 inline-flex items-center gap-1.5 text-sm text-gold font-medium hover:underline">
              <Sparkles size={14} /> Prep with AI Copilot
            </Link>
          </div>

          {fitScore && (
            <div className="bg-card border border-line rounded-2xl p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-slate mb-2">AI Predictive Fit</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="font-display text-4xl font-bold text-ink">{fitScore.fitScorePercent}%</span>
                <span className="text-sm text-slate mb-1">match</span>
              </div>
              <div className="w-full h-2 bg-line rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full ${fitScore.fitScorePercent >= 70 ? 'bg-teal' : fitScore.fitScorePercent >= 40 ? 'bg-gold' : 'bg-coral'}`}
                  style={{ width: `${fitScore.fitScorePercent}%` }}
                />
              </div>
              {fitScore.matchedReasons?.length > 0 && (
                <ul className="text-xs text-teal space-y-1 mb-2">
                  {fitScore.matchedReasons.map((r, i) => <li key={i}>✓ {r}</li>)}
                </ul>
              )}
              {fitScore.gaps?.length > 0 && (
                <ul className="text-xs text-coral space-y-1">
                  {fitScore.gaps.map((g, i) => <li key={i}>△ {g}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
