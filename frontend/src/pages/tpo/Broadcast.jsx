import { useEffect, useState } from 'react'
import { Megaphone, Send, History } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { broadcastNotification, sentNotifications } from '../../api/notifications'

const emptyForm = { title: '', message: '', branch: '', minCgpa: '', maxBacklogs: '', batchYear: '', skill: '' }

export default function Broadcast() {
  const [form, setForm] = useState(emptyForm)
  const [sent, setSent] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const loadHistory = () => sentNotifications().then(setSent).finally(() => setLoadingHistory(false))

  useEffect(() => {
    loadHistory()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setMessage({ type: '', text: '' })
    try {
      const payload = {
        ...form,
        minCgpa: form.minCgpa !== '' ? Number(form.minCgpa) : null,
        maxBacklogs: form.maxBacklogs !== '' ? Number(form.maxBacklogs) : null,
        batchYear: form.batchYear !== '' ? Number(form.batchYear) : null,
      }
      const result = await broadcastNotification(payload)
      setMessage({ type: 'success', text: `Delivered instantly to ${result.recipientCount} eligible student(s).` })
      setForm(emptyForm)
      loadHistory()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Broadcast failed.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardLayout title="Broadcast" subtitle="Input the criteria once, hit send — every qualifying profile is notified simultaneously.">
      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-card border border-line rounded-2xl p-6 space-y-4 h-fit">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone size={18} className="text-gold" />
            <h3 className="font-display text-lg font-semibold text-ink">Compose Broadcast</h3>
          </div>
          <Alert type={message.type}>{message.text}</Alert>

          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Title</label>
            <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Wipro Registrations Open" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Message</label>
            <textarea required rows={3} className="input resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Details students need to know…" />
          </div>

          <div className="pt-3 border-t border-line">
            <p className="text-xs font-mono uppercase tracking-widest text-slate mb-3">Target Audience (leave blank = everyone)</p>
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="Branch" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
              <input type="number" step="0.1" className="input" placeholder="Min CGPA" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: e.target.value })} />
              <input type="number" className="input" placeholder="Max Backlogs" value={form.maxBacklogs} onChange={(e) => setForm({ ...form, maxBacklogs: e.target.value })} />
              <input type="number" className="input" placeholder="Batch Year" value={form.batchYear} onChange={(e) => setForm({ ...form, batchYear: e.target.value })} />
              <input className="input col-span-2" placeholder="Skill" value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} />
            </div>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 bg-ink text-paper font-semibold py-2.5 rounded-lg hover:bg-ink-light transition-colors disabled:opacity-60"
          >
            <Send size={16} /> {sending ? 'Sending…' : 'Broadcast Now'}
          </button>
        </form>

        <div className="bg-card border border-line rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <History size={17} className="text-slate" />
            <h3 className="font-display text-lg font-semibold text-ink">Broadcast History</h3>
          </div>
          {loadingHistory ? (
            <Spinner />
          ) : sent.length === 0 ? (
            <EmptyState icon={Megaphone} title="No broadcasts sent yet" />
          ) : (
            <div className="space-y-3.5 max-h-[520px] overflow-y-auto">
              {sent.map((n) => (
                <div key={n.id} className="border-b border-line/60 pb-3.5 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-ink text-sm">{n.title}</p>
                    <span className="text-[11px] font-mono text-teal shrink-0">{n.recipientCount} reached</span>
                  </div>
                  <p className="text-xs text-slate mt-1">{n.message}</p>
                  <p className="text-[11px] font-mono text-gold mt-1.5">{n.criteriaSummary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
