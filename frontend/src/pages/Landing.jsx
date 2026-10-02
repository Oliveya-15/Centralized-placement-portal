import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Radio, Route, BrainCircuit, GraduationCap, Building2,
  MessagesSquare, FileSpreadsheet, Megaphone, Archive, Sparkles,
  Info, X, MonitorSmartphone, Server, Database, CheckCircle2, XCircle,
} from 'lucide-react'
import PublicNavbar from '../components/layout/PublicNavbar'

const REPO_URL = 'https://github.com/Oliveya-15/Centralized-placement-portal'

const NOTICE_KEY = 'cpp-frontend-only-notice-dismissed'

/* Small reusable status row used inside the notice modal */
function StatusRow({ icon: Icon, label, state, tone }) {
  const ok = state === 'live'
  return (
    <li className="flex items-center gap-3 py-2">
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          ok ? 'bg-teal-light text-teal' : 'bg-coral/10 text-coral'
        }`}
      >
        <Icon size={16} />
      </span>
      <span className="text-sm text-ink flex-1">{label}</span>
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest font-semibold ${
          ok ? 'text-teal' : 'text-coral'
        }`}
      >
        {ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
        {ok ? 'Live' : 'Not deployed'}
      </span>
    </li>
  )
}

export default function Landing() {
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [bannerOpen, setBannerOpen] = useState(true)

  /* Show the full notice once per browser (first visit only) */
  useEffect(() => {
    let seen = null
    try {
      seen = localStorage.getItem(NOTICE_KEY)
    } catch {
      /* localStorage blocked (private mode etc.) — just show it */
    }
    if (!seen) setNoticeOpen(true)
  }, [])

  /* Lock body scroll while the modal is open */
  useEffect(() => {
    document.body.style.overflow = noticeOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [noticeOpen])

  const dismissNotice = () => {
    try {
      localStorage.setItem(NOTICE_KEY, '1')
    } catch {
      /* ignore */
    }
    setNoticeOpen(false)
  }

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      {/* ── Frontend-only notice bar ───────────────────────────── */}
      {bannerOpen && (
        <div className="bg-gold-light/60 border-b border-gold/30">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-2.5 flex items-start sm:items-center gap-3">
            <MonitorSmartphone size={15} className="text-gold mt-0.5 sm:mt-0 shrink-0" />
            <p className="text-xs sm:text-[13px] text-ink/80 flex-1 leading-relaxed">
              <span className="font-semibold text-ink">Frontend-only preview.</span>{' '}
              The Spring Boot API and MySQL database aren&apos;t hosted here, so sign-in,
              registration and live data won&apos;t respond.{' '}
              <button
                type="button"
                onClick={() => setNoticeOpen(true)}
                className="font-semibold text-ink underline underline-offset-2 hover:text-gold transition-colors"
              >
                Details
              </button>
            </p>
            <button
              type="button"
              aria-label="Dismiss notice"
              onClick={() => setBannerOpen(false)}
              className="text-ink/40 hover:text-ink transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 lg:px-8 pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-light/40 text-gold text-xs font-mono uppercase tracking-widest font-semibold mb-6">
          <Sparkles size={14} /> Now with AI Placement Copilot
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-[1.1] tracking-tight">
          One portal for every step<br className="hidden sm:block" /> between campus and career.
        </h1>
        <p className="text-lg text-slate mt-6 max-w-2xl mx-auto">
          CPP brings students and placement cells onto a single platform — eliminating paperwork,
          communication gaps and systemic delays, while AI guides students along corporate hiring
          pipelines.
        </p>
        <div className="flex items-center justify-center gap-3 mt-9">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper font-semibold rounded-xl hover:bg-ink-light transition-colors"
          >
            Create your account <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border-2 border-line text-ink font-semibold rounded-xl hover:border-ink transition-colors"
          >
            I already have one
          </Link>
        </div>

        {/* Inline reminder right under the CTAs */}
        <p className="mt-6 inline-flex items-start sm:items-center gap-2 text-xs sm:text-[13px] text-slate max-w-xl text-left sm:text-center">
          <Info size={14} className="text-gold mt-0.5 sm:mt-0 shrink-0" />
          <span>
            These buttons open the real screens, but the backend isn&apos;t deployed on this
            link — accounts and data need the app running locally.
          </span>
        </p>
      </section>

      {/* Problem vs Solution */}
      <section className="max-w-6xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-card border border-line rounded-2xl p-7">
            <p className="text-xs font-mono uppercase tracking-widest text-coral font-semibold mb-4">
              The current problem
            </p>
            <ul className="space-y-4">
              {[
                ['Scattered updates', 'Information lost across emails, WhatsApp groups and bulletin boards.'],
                ['Layered bureaucracy', 'Students cross multiple admin layers to access a single job posting.'],
                ['Preparation deficit', "Students lack clarity on target companies' interview patterns."],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-coral mt-2 shrink-0" />
                  <div>
                    <p className="font-semibold text-ink text-sm">{title}</p>
                    <p className="text-sm text-slate mt-0.5">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ink border border-ink rounded-2xl p-7 text-paper">
            <p className="text-xs font-mono uppercase tracking-widest text-gold font-semibold mb-4">
              The CPP solution
            </p>
            <ul className="space-y-4">
              {[
                [Radio, 'Unified hub', 'One-click broadcast delivers notifications instantly to every eligible student.'],
                [Route, 'Direct pipeline', 'Zero-layer architecture — apply straight from your dashboard.'],
                [BrainCircuit, 'AI Copilot mentor', 'Personalized prep and a step-by-step interview breakdown per company.'],
              ].map(([Icon, title, body]) => (
                <li key={title} className="flex gap-3">
                  <Icon size={18} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-sm text-paper/60 mt-0.5">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Two-sided ecosystem */}
      <section className="max-w-6xl mx-auto px-5 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-semibold text-ink">A two-sided ecosystem</h2>
          <p className="text-slate mt-2">One dual-portal configuration, two dedicated experiences.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-line rounded-2xl p-7">
            <div className="w-11 h-11 rounded-xl bg-teal-light text-teal flex items-center justify-center mb-4">
              <GraduationCap size={22} />
            </div>
            <h3 className="font-display text-xl font-semibold text-ink">The Student Portal</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate">
              <li className="flex gap-2.5"><FileSpreadsheet size={16} className="text-teal mt-0.5 shrink-0" />One-profile resume builder with a live placement profile.</li>
              <li className="flex gap-2.5"><Route size={16} className="text-teal mt-0.5 shrink-0" />A transparent job feed — no internal layers, no lag.</li>
              <li className="flex gap-2.5"><MessagesSquare size={16} className="text-teal mt-0.5 shrink-0" />Direct 1:1 chat with your assigned TPO professor.</li>
            </ul>
          </div>

          <div className="bg-card border border-line rounded-2xl p-7">
            <div className="w-11 h-11 rounded-xl bg-gold-light/40 text-gold flex items-center justify-center mb-4">
              <Building2 size={22} />
            </div>
            <h3 className="font-display text-xl font-semibold text-ink">The TPO Admin Portal</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate">
              <li className="flex gap-2.5"><FileSpreadsheet size={16} className="text-gold mt-0.5 shrink-0" />Dynamic master ledger — filter instantly, no more Excel.</li>
              <li className="flex gap-2.5"><Megaphone size={16} className="text-gold mt-0.5 shrink-0" />Multi-channel broadcast to every qualifying profile at once.</li>
              <li className="flex gap-2.5"><Archive size={16} className="text-gold mt-0.5 shrink-0" />Clean historical archive of every placement cycle.</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 text-center text-sm text-slate space-y-2">
          <p>Centralized Placement Portal — a single, unified platform for campus placements.</p>
          <p className="text-xs text-slate/70">
            This deployment hosts the React frontend only. The Spring&nbsp;Boot API and MySQL
            database run locally — see the{' '}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-ink underline underline-offset-2 hover:text-gold transition-colors"
            >
              repository
            </a>{' '}
            for setup instructions.
          </p>
        </div>
      </footer>

      {/* ── First-visit modal ──────────────────────────────────── */}
      {noticeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-notice-title"
          onClick={dismissNotice}
        >
          <div
            className="bg-card border border-line rounded-2xl max-w-lg w-full p-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-gold-light/40 text-gold flex items-center justify-center shrink-0">
                <MonitorSmartphone size={22} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-mono uppercase tracking-widest text-gold font-semibold mb-1.5">
                  Please read before exploring
                </p>
                <h2
                  id="demo-notice-title"
                  className="font-display text-xl font-semibold text-ink leading-snug"
                >
                  This link is a frontend-only preview
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close notice"
                onClick={dismissNotice}
                className="text-slate hover:text-ink transition-colors shrink-0 -mt-1"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-slate mt-4 leading-relaxed">
              CPP is a full-stack project — <span className="text-ink font-medium">React + Spring&nbsp;Boot + MySQL</span>.
              Vercel is only hosting the React frontend. There&apos;s no free lifetime MySQL host
              available, so the API and database aren&apos;t running on this deployment.
            </p>

            <ul className="mt-5 divide-y divide-line border-y border-line">
              <StatusRow icon={MonitorSmartphone} label="React frontend (this site)" state="live" />
              <StatusRow icon={Server} label="Spring Boot REST API" state="down" />
              <StatusRow icon={Database} label="MySQL database" state="down" />
            </ul>

            <p className="text-sm text-slate mt-5 leading-relaxed">
              So if buttons feel unresponsive or you see network errors, that&apos;s expected —
              it isn&apos;t a bug. Run the project locally (instructions in the repo) to see the
              full app working end to end.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <button
                type="button"
                onClick={dismissNotice}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ink text-paper font-semibold rounded-xl hover:bg-ink-light transition-colors flex-1"
              >
                Got it — explore the UI
              </button>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-line text-ink font-semibold rounded-xl hover:border-ink transition-colors flex-1"
              >
                View source
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
