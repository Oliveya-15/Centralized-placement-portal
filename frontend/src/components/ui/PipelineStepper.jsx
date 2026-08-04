import { Check, X } from 'lucide-react'

const STAGES = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED']

export default function PipelineStepper({ status }) {
  if (status === 'REJECTED') {
    return (
      <div className="flex items-center gap-2 text-coral text-sm font-medium">
        <div className="w-6 h-6 rounded-full bg-coral-light flex items-center justify-center">
          <X size={14} />
        </div>
        Not selected for this drive
      </div>
    )
  }

  const currentIndex = STAGES.indexOf(status)

  return (
    <div className="flex items-center w-full">
      {STAGES.map((stage, idx) => {
        const done = idx < currentIndex
        const active = idx === currentIndex
        return (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                  done
                    ? 'bg-teal text-white'
                    : active
                    ? 'bg-gold text-ink ring-4 ring-gold-light/50'
                    : 'bg-white border-2 border-line text-slate'
                }`}
              >
                {done ? <Check size={14} /> : idx + 1}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  active ? 'text-ink' : done ? 'text-teal' : 'text-slate'
                }`}
              >
                {stage.charAt(0) + stage.slice(1).toLowerCase()}
              </span>
            </div>
            {idx < STAGES.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1.5 mb-4 ${done ? 'bg-teal' : 'bg-line'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
