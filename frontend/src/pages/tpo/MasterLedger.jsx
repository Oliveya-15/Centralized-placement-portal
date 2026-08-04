import { useEffect, useState } from 'react'
import { Users, Filter, RotateCcw } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { searchLedger } from '../../api/ledger'

const emptyFilters = { branch: '', minCgpa: '', maxBacklogs: '', batchYear: '', skill: '' }

export default function MasterLedger() {
  const [students, setStudents] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)

  const runSearch = (f) => {
    setLoading(true)
    const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''))
    searchLedger(params).then(setStudents).finally(() => setLoading(false))
  }

  useEffect(() => {
    runSearch(emptyFilters)
  }, [])

  const handleApply = (e) => {
    e.preventDefault()
    runSearch(filters)
  }

  const handleReset = () => {
    setFilters(emptyFilters)
    runSearch(emptyFilters)
  }

  return (
    <DashboardLayout title="Master Ledger" subtitle="Every student profile, filterable instantly — no more spreadsheets.">
      <form onSubmit={handleApply} className="bg-card border border-line rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-gold" />
          <p className="text-sm font-semibold text-ink">Filter for:</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input className="input" placeholder="Branch (e.g. CSE)" value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })} />
          <input type="number" step="0.1" className="input" placeholder="Min CGPA" value={filters.minCgpa} onChange={(e) => setFilters({ ...filters, minCgpa: e.target.value })} />
          <input type="number" className="input" placeholder="Max Backlogs" value={filters.maxBacklogs} onChange={(e) => setFilters({ ...filters, maxBacklogs: e.target.value })} />
          <input type="number" className="input" placeholder="Batch Year" value={filters.batchYear} onChange={(e) => setFilters({ ...filters, batchYear: e.target.value })} />
          <input className="input" placeholder="Skill (e.g. Java)" value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })} />
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-ink text-paper text-sm font-semibold px-4 py-2 rounded-lg hover:bg-ink-light transition-colors">
            Apply Filters
          </button>
          <button type="button" onClick={handleReset} className="flex items-center gap-1.5 text-sm font-medium text-slate border border-line px-4 py-2 rounded-lg hover:border-ink hover:text-ink transition-colors">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </form>

      {loading ? (
        <Spinner />
      ) : students.length === 0 ? (
        <EmptyState icon={Users} title="No matching students" description="Try relaxing your filters." />
      ) : (
        <div className="bg-card border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full ledger-table">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Batch</th>
                <th>CGPA</th>
                <th>Backlogs</th>
                <th>Skills</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.userId}>
                  <td>{s.rollNumber || '—'}</td>
                  <td className="font-sans font-medium text-ink">{s.fullName}</td>
                  <td>{s.branch || '—'}</td>
                  <td>{s.batchYear || '—'}</td>
                  <td>{s.cgpa ?? '—'}</td>
                  <td>{s.activeBacklogs ?? 0}</td>
                  <td className="font-sans text-xs text-slate max-w-xs truncate">{s.skills || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate px-4 py-3 border-t border-line">{students.length} student{students.length === 1 ? '' : 's'} matched</p>
        </div>
      )}
    </DashboardLayout>
  )
}
