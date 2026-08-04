import { useEffect, useRef, useState } from 'react'
import { Send, MessagesSquare } from 'lucide-react'
import Spinner from './Spinner'
import EmptyState from './EmptyState'
import { getContacts, getThread, sendMessage } from '../../api/messages'
import { useAuth } from '../../context/AuthContext'

export default function ChatInbox({ fallbackContact }) {
  const { user } = useAuth()
  const [contacts, setContacts] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    getContacts()
      .then((data) => {
        let list = data
        if (fallbackContact && !list.some((c) => c.userId === fallbackContact.userId)) {
          list = [fallbackContact, ...list]
        }
        setContacts(list)
        if (list.length > 0) setActiveId(list[0].userId)
      })
      .finally(() => setLoadingContacts(false))
  }, [fallbackContact?.userId])

  useEffect(() => {
    if (!activeId) return
    setLoadingThread(true)
    getThread(activeId)
      .then(setThread)
      .finally(() => setLoadingThread(false))
  }, [activeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!draft.trim() || !activeId) return
    const content = draft.trim()
    setDraft('')
    const optimistic = { id: `temp-${Date.now()}`, senderId: user.userId, receiverId: activeId, content, sentAt: new Date().toISOString() }
    setThread((t) => [...t, optimistic])
    await sendMessage(activeId, content)
    const fresh = await getThread(activeId)
    setThread(fresh)
  }

  if (loadingContacts) return <Spinner />

  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="No conversations yet"
        description="Once you or your contact send the first message, it'll show up here."
      />
    )
  }

  const activeContact = contacts.find((c) => c.userId === activeId)

  return (
    <div className="bg-card border border-line rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[260px_1fr] h-[600px]">
      <div className="border-r border-line overflow-y-auto">
        {contacts.map((c) => (
          <button
            key={c.userId}
            onClick={() => setActiveId(c.userId)}
            className={`w-full text-left px-4 py-3.5 border-b border-line/60 flex items-center gap-3 transition-colors ${
              activeId === c.userId ? 'bg-gold-light/25' : 'hover:bg-ink/[0.03]'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-ink text-gold-light flex items-center justify-center text-xs font-semibold font-mono shrink-0">
              {c.fullName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink truncate">{c.fullName}</p>
              <p className="text-xs text-slate">{c.role === 'TPO' ? 'TPO Professor' : 'Student'}</p>
            </div>
            {c.unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-coral text-white text-[10px] flex items-center justify-center font-semibold shrink-0">
                {c.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col min-w-0">
        <div className="px-5 py-3.5 border-b border-line flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-ink text-gold-light flex items-center justify-center text-xs font-semibold font-mono">
            {activeContact?.fullName?.[0]}
          </div>
          <p className="font-semibold text-ink text-sm">{activeContact?.fullName}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {loadingThread ? (
            <Spinner />
          ) : (
            thread.map((m) => {
              const mine = m.senderId === user.userId
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                      mine ? 'bg-ink text-paper rounded-br-sm' : 'bg-ink/5 text-ink rounded-bl-sm'
                    }`}
                  >
                    {m.content}
                    <p className={`text-[10px] mt-1 ${mine ? 'text-paper/50' : 'text-slate'}`}>
                      {new Date(m.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="p-3.5 border-t border-line flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            className="input flex-1"
          />
          <button type="submit" className="w-11 h-11 shrink-0 rounded-lg bg-ink text-paper flex items-center justify-center hover:bg-ink-light transition-colors">
            <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  )
}
