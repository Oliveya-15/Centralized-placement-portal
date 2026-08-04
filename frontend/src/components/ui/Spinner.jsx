export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate gap-3">
      <div className="w-8 h-8 border-[3px] border-line border-t-gold rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
