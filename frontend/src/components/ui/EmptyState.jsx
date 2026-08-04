export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border-2 border-dashed border-line rounded-2xl bg-card/50">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-ink/5 flex items-center justify-center mb-4 text-slate">
          <Icon size={26} />
        </div>
      )}
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {description && <p className="text-sm text-slate mt-1.5 max-w-sm">{description}</p>}
    </div>
  )
}
