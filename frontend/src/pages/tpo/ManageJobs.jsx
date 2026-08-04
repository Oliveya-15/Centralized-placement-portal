import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FolderKanban, Users, Lock, Eye } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Alert from '../../components/ui/Alert'
import { listMyJobs, closeJob } from '../../api/jobs'

export default function ManageJobs() {
  const location = useLocation()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(location.state?.justCreated ? `${location.state.justCreated} drive published.` : '')

  const load = () => listMyJobs().then(setJobs).finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const handleClose = async (id) => {
    await closeJob(id)
    setNotice('Drive closed for new applications.')
    load()
  }

  return (
    <DashboardLayout title="Manage Drives" subtitle="Every posting you've published, and its current pipeline health.">
      <Alert type="success">{notice}</Alert>

      {loading ? (
        <Spinner />
      ) : jobs.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No drives posted yet" description="Head to 'Post a Drive' to publish your first opening." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="pass-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{job.companyName}</h3>
                  <p className="text-sm text-slate">{job.roleTitle}</p>
                </div>
                <span className={`text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full ${job.status === 'OPEN' ? 'bg-teal-light text-teal' : 'bg-ink/5 text-slate'}`}>
                  {job.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate mt-3">
                <span className="flex items-center gap-1.5"><Users size={13} /> {job.applicantCount} applicant{job.applicantCount === 1 ? '' : 's'}</span>
                <span>CTC {job.ctcLpa ? `${job.ctcLpa} LPA` : '—'}</span>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-line/70">
                <Link
                  to={`/tpo/jobs/${job.id}/applications`}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium border border-line rounded-lg py-2 hover:border-gold hover:text-gold transition-colors"
                >
                  <Eye size={15} /> View Applications
                </Link>
                {job.status === 'OPEN' && (
                  <button
                    onClick={() => handleClose(job.id)}
                    className="flex items-center justify-center gap-1.5 text-sm font-medium border border-line rounded-lg py-2 px-3 hover:border-coral hover:text-coral transition-colors"
                  >
                    <Lock size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
