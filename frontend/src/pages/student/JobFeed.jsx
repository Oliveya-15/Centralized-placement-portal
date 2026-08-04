import { useEffect, useMemo, useState } from 'react'
import { Search, Briefcase } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import JobCard from '../../components/ui/JobCard'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { listOpenJobs } from '../../api/jobs'

export default function JobFeed() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  useEffect(() => {
    listOpenJobs().then(setJobs).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesQuery =
        !query ||
        j.companyName.toLowerCase().includes(query.toLowerCase()) ||
        j.roleTitle.toLowerCase().includes(query.toLowerCase())
      const matchesType = typeFilter === 'ALL' || j.jobType === typeFilter
      return matchesQuery && matchesType
    })
  }, [jobs, query, typeFilter])

  return (
    <DashboardLayout title="Job Feed" subtitle="A transparent, simultaneous timeline of every active opening.">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by company or role…"
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'FULL_TIME', 'INTERNSHIP'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap ${
                typeFilter === t ? 'bg-ink text-paper border-ink' : 'border-line text-slate hover:border-ink'
              }`}
            >
              {t === 'ALL' ? 'All' : t === 'FULL_TIME' ? 'Full-Time' : 'Internship'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Briefcase} title="No drives match your search" description="Try a different keyword or filter." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
