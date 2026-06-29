'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send reset email')
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">Forgot Password</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Enter your email and we will send you a reset link.
      </p>

      {done ? (
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4">Check Your Email</h2>
          <p className="text-green-600 dark:text-green-400 mb-4">
            If an account with that email exists, a password reset link has been sent.
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm dark:shadow-gray-900/30 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {submitting ? 'Sending...' : 'Send Reset Link'}
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}
