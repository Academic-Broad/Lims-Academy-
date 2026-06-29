'use client'

import { useState, FormEvent, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Role } from '@/lib/roles'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Password setup mode
  const setupToken = searchParams.get('setup')
  const isSetup = !!setupToken

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isSetup) {
      try {
        const res = await fetch('/api/auth/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token: setupToken, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Setup failed')

        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
        if (result?.error) throw new Error('Login failed after setup')
        router.push('/parent/dashboard')
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Setup failed')
      } finally {
        setLoading(false)
      }
      return
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password')
      return
    }

    const res = await fetch('/api/auth/session')
    const session = await res.json()
    if (session?.user?.role === Role.ADMIN) {
      router.push('/admin/dashboard')
    } else {
      router.push('/parent/dashboard')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">
        {isSetup ? 'Set Your Password' : 'Sign In'}
      </h1>
      <p className="text-gray-600 text-center mb-8">
        {isSetup
          ? 'Create a password for your new account.'
          : 'Access your parent or admin dashboard.'}
      </p>

      <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm dark:shadow-gray-900/30 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            required
            value={email}
            readOnly={isSetup}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            {isSetup ? 'New Password' : 'Password'}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSetup ? 'At least 6 characters' : ''}
            className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Please wait...' : isSetup ? 'Set Password & Sign In' : 'Sign In'}
        </button>
        {!isSetup && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
              Forgot Password?
            </Link>
          </p>
        )}
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
