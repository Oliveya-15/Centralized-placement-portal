import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles, Search, ListChecks, HelpCircle, Lightbulb } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/ui/Spinner'
import { listOpenJobs } from '../../api/jobs'
import { getPrepGuide } from '../../api/ai'

export default function AiCopilot() {
  const location = useLocation()
  const [companies, setCompanies] = useState([])
  const [selected, setSelected] = useState(location.state?.company || '')
  const [customQuery, setCustomQuery] = useState('')
  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    listOpenJobs().then((jobs) => {
      const unique = [...new Set(jobs.map((j) => j.companyName))]
      setCompanies(unique)
    })
  }, [])

  useEffect(() => {
    if (selected) fetchGuide(selected)
  }, [selected])

  const fetchGuide = async (company) => {
    setLoading(true)
    try {
      const data = await getPrepGuide(company)
      setGuide(data)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomSearch = (e) => {
    e.preventDefault()
    if (customQuery.trim()) {
      setSelected(customQuery.trim())
    }
  }

  return (
    <DashboardLayout title="AI Placement Copilot" subtitle="Company process mapping, tailored Q&A and prep tips — instantly.">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-card border border-line rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-gold" />
            <h3 className="font-display text-lg font-semibold text-ink">Pick a company</h3>
          </div>

          <form onSubmit={handleCustomSearch} className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
            <input
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Search any company…"
              className="input pl-9"
            />
          </form>

          <div className="flex flex-wrap gap-2">
            {companies.map((c) => (
              <button
                key={c}
                onClick={() => setSelected(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  selected === c ? 'bg-ink text-paper border-ink' : 'border-line text-slate hover:border-gold hover:text-gold'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selected ? (
            <div className="bg-card border-2 border-dashed border-line rounded-2xl p-10 text-center">
              <Sparkles size={28} className="text-gold mx-auto mb-3" />
              <p className="font-display text-lg font-semibold text-ink">Select or search a company</p>
              <p className="text-sm text-slate mt-1">Your copilot will map out the exact hiring pipeline and prep plan.</p>
            </div>
          ) : loading ? (
            <Spinner label={`Mapping ${selected}'s pipeline…`} />
          ) : guide ? (
            <div className="space-y-5">
              <div className="pass-card p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-gold font-semibold mb-1">
                  {guide.generated ? 'AI-generated generic guide' : 'Curated guide'}
                </p>
                <h3 className="font-display text-2xl font-semibold text-ink mb-4">{guide.companyName}</h3>

                <div className="flex items-center gap-2 mb-2">
                  <ListChecks size={16} className="text-teal" />
                  <h4 className="font-semibold text-ink text-sm">Recruitment Pipeline</h4>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {guide.roundsBreakdown.split('->').map((r, i) => (
                    <span key={i} className="text-xs font-mono px-3 py-1.5 rounded-full bg-teal-light text-teal">
                      {r.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle size={16} className="text-gold" />
                  <h4 className="font-semibold text-ink text-sm">Commonly Asked Questions</h4>
                </div>
                <ul className="text-sm text-slate space-y-1.5 mb-6">
                  {guide.commonQuestions.split('|').map((q, i) => (
                    <li key={i} className="flex gap-2"><span className="text-gold">•</span>{q.trim()}</li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={16} className="text-coral" />
                  <h4 className="font-semibold text-ink text-sm">Prep Tips</h4>
                </div>
                <p className="text-sm text-slate leading-relaxed">{guide.tips}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  )
}
