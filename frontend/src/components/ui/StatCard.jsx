export default function StatCard({ label, value, icon: Icon, accent = 'gold' }) {
  const accentClasses = {
    gold: 'bg-gold-light/40 text-gold',
    teal: 'bg-teal-light text-teal',
    coral: 'bg-coral-light text-coral',
    ink: 'bg-ink/5 text-ink',
  }

  return (
    <div className="bg-card rounded-2xl border border-line p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accentClasses[accent]}`}>
        {Icon && <Icon size={22} />}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-display font-semibold text-ink leading-none">{value}</p>
        <p className="text-sm text-slate mt-1.5">{label}</p>
      </div>
    </div>
  )
}
