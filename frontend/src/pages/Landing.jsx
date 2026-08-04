import { Link } from 'react-router-dom'
import {
  ArrowRight, Radio, Route, BrainCircuit, GraduationCap, Building2,
  MessagesSquare, FileSpreadsheet, Megaphone, Archive, Sparkles,
} from 'lucide-react'
import PublicNavbar from '../components/layout/PublicNavbar'

export default function Landing() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />

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

      <footer className="border-t border-line py-8 text-center text-sm text-slate">
        Centralized Placement Portal — a single, unified platform for campus placements.
      </footer>
    </div>
  )
}
