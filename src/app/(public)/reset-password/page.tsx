'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reset password')
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">Invalid Link</h1>
          <p className="text-red-600 dark:text-red-400 mb-4">This reset link is invalid or missing parameters.</p>
          <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">Reset Password</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Enter your new password for {email}
      </p>

      {done ? (
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4">Password Reset Successful</h2>
          <p className="text-green-600 dark:text-green-400 mb-4">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm dark:shadow-gray-900/30 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {submitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
