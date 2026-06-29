'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@/lib/roles'

export default function CreateUserPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    studentFirstName: '',
    studentLastName: '',
    studentAge: '',
    studentGrade: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ tempPassword: string; parent: { name: string; email: string }; student: { name: string } } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== Role.ADMIN) router.push('/parent/dashboard')
  }, [status, router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create')
      setResult(data)
      setForm({ parentName: '', parentEmail: '', parentPhone: '', studentFirstName: '', studentLastName: '', studentAge: '', studentGrade: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Create Parent & Student</h1>

      {result ? (
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-green-700 dark:text-green-300 mb-4">Account Created Successfully!</h2>
          <div className="space-y-2 text-sm text-gray-900 dark:text-gray-100">
            <p><strong>Parent:</strong> {result.parent.name} ({result.parent.email})</p>
            <p><strong>Student:</strong> {result.student.name}</p>
            <p><strong>Temporary Password:</strong> <code className="bg-green-100 dark:bg-green-900/60 px-2 py-0.5 rounded font-mono">{result.tempPassword}</code></p>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-4">A password-setup email was sent to the parent.</p>
          <button
            onClick={() => setResult(null)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
          >
            Create Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm dark:shadow-gray-900/30 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Parent Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Full Name *</label>
                <input type="text" required value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                  className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Email *</label>
                  <input type="email" required value={form.parentEmail} onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Phone</label>
                  <input type="tel" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Student Information</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">First Name *</label>
                  <input type="text" required value={form.studentFirstName} onChange={(e) => setForm({ ...form, studentFirstName: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Last Name *</label>
                  <input type="text" required value={form.studentLastName} onChange={(e) => setForm({ ...form, studentLastName: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Age *</label>
                  <input type="number" required min={2} max={20} value={form.studentAge} onChange={(e) => setForm({ ...form, studentAge: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Grade *</label>
                  <select required value={form.studentGrade} onChange={(e) => setForm({ ...form, studentGrade: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Select...</option>
                    <option value="Pre-K">Pre-K</option>
                    <option value="Kindergarten">Kindergarten</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
            {submitting ? 'Creating...' : 'Create Parent & Student'}
          </button>
        </form>
      )}
    </div>
  )
}
