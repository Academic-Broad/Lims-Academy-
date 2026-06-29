'use client'

import { useState, FormEvent } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send')
      }
      setDone(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll respond promptly.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          {done ? (
            <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg p-6 text-green-700 dark:text-green-300">
              <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
              <p>Thank you for reaching out. We will get back to you shortly.</p>
              <button
                onClick={() => setDone(false)}
                className="mt-4 text-green-600 underline hover:no-underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Visit Us</h3>
            <p className="text-gray-600 dark:text-gray-400">No 2 Imo Street, Narayi,<br />Kaduna, Nigeria</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Call Us</h3>
            <p className="text-gray-600 dark:text-gray-400">+234 7011092746</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Email Us</h3>
            <p className="text-gray-600 dark:text-gray-400">limsreadinghub1@gmail.com</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Office Hours</h3>
            <p className="text-gray-600 dark:text-gray-400">Thursday- Saturday : 8:00 AM - 4:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
