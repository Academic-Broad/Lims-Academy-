'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@/lib/roles'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
}

export default function AdminMessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== Role.ADMIN) router.push('/parent/dashboard')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMessages()
    }
  }, [status, filter])

  async function fetchMessages() {
    setLoading(true)
    try {
      const url = filter ? `/api/admin/messages?filter=${filter}` : '/api/admin/messages'
      const res = await fetch(url)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleRead(msg: ContactMessage) {
    const action = msg.isRead ? 'mark-unread' : 'mark-read'
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, action }),
      })
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: !m.isRead } : m))
        )
        if (selected?.id === msg.id) {
          setSelected({ ...selected, isRead: !selected.isRead })
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (status === 'loading') return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Messages from Parents</h1>

      <div className="flex gap-2 mb-6">
        {[null, 'unread', 'read'].map((f) => (
          <button
            key={f ?? 'all'}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f === null ? 'All' : f === 'unread' ? 'Unread' : 'Read'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm dark:shadow-gray-900/30">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No messages found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelected(m)}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm dark:shadow-gray-900/30 border-l-4 cursor-pointer transition hover:shadow-md ${
                  m.isRead ? 'border-gray-300 dark:border-gray-600' : 'border-blue-500'
                } ${selected?.id === m.id ? 'ring-2 ring-blue-400' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{m.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{m.subject || 'No subject'}</p>
                  </div>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                    m.isRead ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                  }`}>
                    {m.isRead ? 'Read' : 'New'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div>
            {selected ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30 sticky top-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.subject || '(No Subject)'}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selected.name} &lt;{selected.email}&gt;
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => toggleRead(selected)}
                    className={`text-sm px-3 py-1 rounded-lg font-medium transition ${
                      selected.isRead
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-950/60'
                    }`}
                  >
                    {selected.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                </div>
                <div className="border-t dark:border-gray-700 pt-4">
                  <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="border-t dark:border-gray-700 pt-4 mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Reply by email:</p>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Message'}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center shadow-sm dark:shadow-gray-900/30">
                <p className="text-gray-500 dark:text-gray-400">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
