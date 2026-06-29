'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@/lib/roles'

export default function AdminChangeEmailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== Role.ADMIN) router.push('/parent/dashboard')
  }, [status, router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    if (newEmail !== confirmEmail) {
      setError('Emails do not match')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, newEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to change email')
      setSuccess('Email changed successfully. Please sign out and sign back in.')
      setPassword('')
      setNewEmail('')
      setConfirmEmail('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Change Email</h1>

      <div className="mb-6 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg">
        Current email: <strong>{session?.user?.email}</strong>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm dark:shadow-gray-900/30 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Current Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">New Email</label>
          <input
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Confirm New Email</label>
          <input
            type="email"
            required
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="Repeat your new email"
            className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {submitting ? 'Changing...' : 'Change Email'}
        </button>
      </form>
    </div>
  )
}
