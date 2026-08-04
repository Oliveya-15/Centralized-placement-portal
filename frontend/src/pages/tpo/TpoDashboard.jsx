import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Users, Briefcase, ClipboardCheck, Award } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Spinner from '../../components/ui/Spinner'
import { getTpoStats } from '../../api/dashboard'

const STATUS_COLORS = {
  APPLIED: '#5B6472',
  SHORTLISTED: '#C9982E',
  INTERVIEW: '#1B3A5C',
  SELECTED: '#1B6F5E',
  REJECTED: '#BE4B3A',
}

export default function TpoDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTpoStats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout title="Dashboard"><Spinner /></DashboardLayout>
  if (!stats) return null

  const pieData = Object.entries(stats.applicationsByStatus || {}).map(([status, count]) => ({
    name: status.charAt(0) + status.slice(1).toLowerCase(),
    value: count,
    color: STATUS_COLORS[status] || '#5B6472',
  }))

  return (
    <DashboardLayout title="TPO Dashboard" subtitle="A single view of every drive, applicant and outcome you own.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Registered students" value={stats.totalStudents} icon={Users} accent="ink" />
        <StatCard label="Drives posted" value={stats.totalJobs} icon={Briefcase} accent="gold" />
        <StatCard label="Applications received" value={stats.totalApplications} icon={ClipboardCheck} accent="teal" />
        <StatCard label="Offers made" value={stats.selectedCount} icon={Award} accent="teal" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-line rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">Applications by stage</h3>
          {pieData.length === 0 ? (
            <p className="text-sm text-slate">No applications yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card border border-line rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">Top drives by applicants</h3>
          {stats.topCompaniesByApplicants?.length === 0 ? (
            <p className="text-sm text-slate">No applications yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.topCompaniesByApplicants} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCD8CC" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#5B6472' }} />
                <YAxis type="category" dataKey="companyName" width={90} tick={{ fontSize: 12, fill: '#10233D' }} />
                <Tooltip />
                <Bar dataKey="applicantCount" fill="#C9982E" radius={[0, 6, 6, 0]} name="Applicants" />
                <Bar dataKey="selectedCount" fill="#1B6F5E" radius={[0, 6, 6, 0]} name="Selected" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
