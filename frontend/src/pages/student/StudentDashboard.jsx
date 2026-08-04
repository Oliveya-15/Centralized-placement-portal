import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, ClipboardCheck, Bell, ArrowRight, Sparkles } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import StatusStamp from '../../components/ui/StatusStamp'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { myApplications } from '../../api/applications'
import { myNotifications } from '../../api/notifications'
import { listOpenJobs } from '../../api/jobs'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [notifications, setNotifications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([myApplications(), myNotifications(), listOpenJobs()])
      .then(([apps, notifs, jobList]) => {
        setApplications(apps)
        setNotifications(notifs)
        setJobs(jobList)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout title="Dashboard"><Spinner /></DashboardLayout>

  const selected = applications.filter((a) => a.status === 'SELECTED').length
  const inProgress = applications.filter((a) => !['SELECTED', 'REJECTED'].includes(a.status)).length

  return (
    <DashboardLayout title={`Welcome, ${user.fullName.split(' ')[0]}`} subtitle="Here's where your placement journey stands today.">
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Open drives right now" value={jobs.length} icon={Briefcase} accent="gold" />
        <StatCard label="Applications in progress" value={inProgress} icon={ClipboardCheck} accent="ink" />
        <StatCard label="Offers secured" value={selected} icon={Sparkles} accent="teal" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-line rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-ink">Recent applications</h2>
            <Link to="/student/applications" className="text-sm text-gold font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {applications.length === 0 ? (
            <EmptyState icon={Briefcase} title="No applications yet" description="Head to the job feed and apply to your first drive." />
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-line/70 hover:border-gold transition-colors">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">{app.companyName}</p>
                    <p className="text-xs text-slate truncate">{app.roleTitle}</p>
                  </div>
                  <StatusStamp status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-line rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
              <Bell size={17} className="text-gold" /> Broadcasts
            </h2>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-slate">No broadcasts yet — your TPO's announcements will show up here.</p>
          ) : (
            <div className="space-y-3.5">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className="border-b border-line/60 pb-3.5 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-ink">{n.title}</p>
                  <p className="text-xs text-slate mt-1 line-clamp-2">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
