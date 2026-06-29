'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@/lib/roles'

interface FeeCategory {
  id: string
  value: string
  label: string
  description: string | null
  sortOrder: number
  isActive: boolean
}

export default function FeeCategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<FeeCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FeeCategory | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ value: '', label: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== Role.ADMIN) router.push('/parent/dashboard')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCategories()
    }
  }, [status])

  async function fetchCategories() {
    try {
      const res = await fetch('/api/admin/fee-categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(cat: FeeCategory) {
    setEditing(cat)
    setShowForm(true)
    setForm({ value: cat.value, label: cat.label, description: cat.description || '' })
    setError('')
  }

  function startCreate() {
    setEditing(null)
    setShowForm(true)
    setForm({ value: '', label: '', description: '' })
    setError('')
  }

  function cancelEdit() {
    setEditing(null)
    setShowForm(false)
    setForm({ value: '', label: '', description: '' })
    setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.value || !form.label) {
      setError('Value and label are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editing) {
        const res = await fetch('/api/admin/fee-categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...form }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to update')
        }
      } else {
        const res = await fetch('/api/admin/fee-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to create')
        }
      }
      await fetchCategories()
      cancelEdit()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(cat: FeeCategory) {
    try {
      const res = await fetch('/api/admin/fee-categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id, isActive: !cat.isActive }),
      })
      if (res.ok) await fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? Existing payments using it will not be affected.')) return
    try {
      const res = await fetch(`/api/admin/fee-categories?id=${id}`, { method: 'DELETE' })
      if (res.ok) await fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fee Categories</h1>
        <button
          onClick={startCreate}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {editing ? 'Edit Category' : 'New Category'}
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Value *</label>
                  <input
                    type="text"
                    required
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. BusFee"
                    disabled={!!editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Label *</label>
                  <input
                    type="text"
                    required
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Bus Fee"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Transportation services"
                  />
                </div>
              </div>
              {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No fee categories yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Click &quot;+ Add Category&quot; to create one.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Value</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Label</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Description</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{cat.sortOrder}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{cat.value}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{cat.label}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{cat.description || '-'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full transition ${
                        cat.isActive
                          ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium mr-3 underline underline-offset-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-medium underline underline-offset-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
