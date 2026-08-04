import { Link } from 'react-router-dom'
import { MapPin, Briefcase, Calendar, ArrowUpRight } from 'lucide-react'

function formatDeadline(dateStr) {
  if (!dateStr) return 'Rolling'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function JobCard({ job }) {
  const branches = job.eligibleBranches
    ? job.eligibleBranches.split(',').map((b) => b.trim())
    : ['All Branches']

  return (
    <Link to={`/student/jobs/${job.id}`} className="pass-card flex flex-col sm:flex-row group">
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-gold font-semibold">
              {job.jobType === 'INTERNSHIP' ? 'Internship' : 'Full-Time Drive'}
            </p>
            <h3 className="font-display text-xl font-semibold text-ink mt-0.5">{job.companyName}</h3>
            <p className="text-sm text-slate">{job.roleTitle}</p>
          </div>
          <ArrowUpRight size={20} className="text-slate group-hover:text-gold transition-colors shrink-0" />
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-xs text-slate">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {job.location || 'Not specified'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} /> Apply by {formatDeadline(job.applicationDeadline)}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase size={13} /> {job.applicantCount} applicant{job.applicantCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {branches.map((b) => (
            <span key={b} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-ink/5 text-ink/70">
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="pass-perforation sm:hidden" />

      <div className="sm:w-40 shrink-0 border-t sm:border-t-0 sm:border-l-2 sm:border-dashed border-line p-5 flex sm:flex-col items-center justify-between sm:justify-center gap-2 bg-ink/[0.02]">
        <div className="text-center">
          <p className="font-mono text-2xl font-bold text-ink">
            {job.ctcLpa ? `₹${job.ctcLpa}` : '—'}
          </p>
          <p className="text-[11px] text-slate uppercase tracking-wide">LPA</p>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-teal">
          {job.status === 'OPEN' ? '● Open' : '○ Closed'}
        </span>
      </div>
    </Link>
  )
}
