import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

const VARIANTS = {
  error: { classes: 'bg-coral-light text-coral border-coral/30', Icon: AlertCircle },
  success: { classes: 'bg-teal-light text-teal border-teal/30', Icon: CheckCircle2 },
  info: { classes: 'bg-ink/5 text-ink border-ink/10', Icon: Info },
}

export default function Alert({ type = 'info', children }) {
  if (!children) return null
  const { classes, Icon } = VARIANTS[type] || VARIANTS.info

  return (
    <div className={`flex items-start gap-2.5 border rounded-xl px-4 py-3 text-sm mb-4 ${classes}`}>
      <Icon size={18} className="shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  )
}
