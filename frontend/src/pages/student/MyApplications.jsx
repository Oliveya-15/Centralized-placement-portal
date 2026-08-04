import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import PipelineStepper from '../../components/ui/PipelineStepper'
import { myApplications } from '../../api/applications'

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    myApplications().then(setApplications).finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout title="My Applications" subtitle="Track every drive you've applied to, stage by stage.">
      {loading ? (
        <Spinner />
      ) : applications.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications yet" description="Applications you submit from the job feed will appear here with live status tracking." />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="pass-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{app.companyName}</h3>
                  <p className="text-sm text-slate">{app.roleTitle}</p>
                </div>
                <p className="text-xs text-slate font-mono">
                  Applied {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <PipelineStepper status={app.status} />
              {app.tpoNotes && (
                <div className="mt-4 pt-4 border-t border-line/70 text-sm">
                  <span className="text-slate">TPO note: </span>
                  <span className="text-ink">{app.tpoNotes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
