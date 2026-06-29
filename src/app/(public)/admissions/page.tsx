'use client'

import { useState, FormEvent } from 'react'

export default function AdmissionsPage() {
  const [form, setForm] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    studentName: '',
    studentAge: '',
    studentGrade: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit')
      }
      setDone(true)
      setForm({ parentName: '', parentEmail: '', parentPhone: '', studentName: '', studentAge: '', studentGrade: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Online Admissions</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Apply for admission to LIMS Academy. Fill out the form below and our admissions team will review your application.
      </p>

      {done ? (
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">Application Submitted!</h2>
          <p className="text-green-600 dark:text-green-400 mb-4">
            Thank you for applying to LIMS Academy. Our admissions team will review your application and get back to you within 3-5 business days.
          </p>
          <button
            onClick={() => setDone(false)}
            className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
          >
            Submit Another Application
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Parent / Guardian Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.parentName}
                  onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                  className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.parentEmail}
                    onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Phone Number</label>
                  <input
                    type="tel"
                    value={form.parentPhone}
                    onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Student Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Age *</label>
                  <input
                    type="number"
                    required
                    min={2}
                    max={20}
                    value={form.studentAge}
                    onChange={(e) => setForm({ ...form, studentAge: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Grade Applying For *</label>
                  <select
                    required
                    value={form.studentGrade}
                    onChange={(e) => setForm({ ...form, studentGrade: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select grade...</option>
                    <option value="Pre-K">Pre-K</option>
                    <option value="Kindergarten">Kindergarten</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Additional Information (Optional)</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                  placeholder="Any special needs, previous school, or other information..."
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      )}
    </div>
  )
}
