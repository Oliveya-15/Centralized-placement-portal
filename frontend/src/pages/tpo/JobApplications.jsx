import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import StatusStamp from '../../components/ui/StatusStamp'
import { applicationsForJob, updateApplicationStatus } from '../../api/applications'
import { getJob } from '../../api/jobs'

const STAGES = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED']

export default function JobApplications() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const load = () =>
    Promise.all([getJob(jobId), applicationsForJob(jobId)]).then(([j, apps]) => {
      setJob(j)
      setApplications(apps)
    })

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [jobId])

  const handleStatusChange = async (appId, status) => {
    setUpdatingId(appId)
    try {
      await updateApplicationStatus(appId, { status })
      await load()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <DashboardLayout title={job ? `${job.companyName} · Applicants` : 'Applicants'} subtitle={job?.roleTitle}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-5">
        <ArrowLeft size={15} /> Back to drives
      </button>

      {loading ? (
        <Spinner />
      ) : applications.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications yet" description="Once students apply, they'll show up here for review." />
      ) : (
        <div className="bg-card border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full ledger-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>CGPA</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Move To</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="font-sans">
                    <p className="font-semibold text-ink">{app.studentName}</p>
                    <p className="text-xs text-slate">{app.studentEmail}</p>
                  </td>
                  <td>{app.studentCgpa ?? '—'}</td>
                  <td>{new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td><StatusStamp status={app.status} /></td>
                  <td>
                    <select
                      value={app.status}
                      disabled={updatingId === app.id}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="input py-1.5 text-xs w-40"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
