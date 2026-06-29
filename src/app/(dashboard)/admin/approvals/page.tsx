'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@/lib/roles'

interface Approval {
  id: string
  parentName: string
  parentEmail: string
  parentPhone: string | null
  studentName: string
  studentAge: number
  studentGrade: string
  message: string | null
  status: string
  createdAt: string
}

interface ApprovalResult {
  success: boolean
  status: string
  error?: string
  isNewParent?: boolean
  message?: string
  tempPassword?: string
  parent?: { id: string; name: string; email: string }
  student?: { id: string; name: string }
}

export default function ApprovalsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastResult, setLastResult] = useState<ApprovalResult | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== Role.ADMIN) router.push('/parent/dashboard')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApprovals()
    }
  }, [status])

  async function fetchApprovals() {
    try {
      const res = await fetch('/api/admin/approvals')
      const data = await res.json()
      setApprovals(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setProcessing(id)
    setError('')
    setSuccess('')
    setLastResult(null)
    try {
      const res = await fetch('/api/admin/approvals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      const data: ApprovalResult = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${action} approval`)
      }
      await fetchApprovals()
      setLastResult(data)
      setSuccess(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setProcessing(null)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
  }

  const pending = approvals.filter((a) => a.status === 'Pending')
  const history = approvals.filter((a) => a.status !== 'Pending')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Pending Approvals</h1>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
          <p className="font-medium">{lastResult?.message || success}</p>
          {lastResult?.tempPassword && (
            <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/40 rounded border border-green-300 dark:border-green-700">
              <p className="text-sm font-medium mb-1">Temporary Password (share with parent):</p>
              <p className="text-lg font-mono font-bold select-all">{lastResult.tempPassword}</p>
              <p className="text-xs mt-2 opacity-75">A setup link has also been sent to {lastResult.parent?.email}</p>
            </div>
          )}
          {lastResult && !lastResult.isNewParent && (
            <p className="text-sm mt-1">Linked to existing parent account: {lastResult.parent?.name} ({lastResult.parent?.email})</p>
          )}
        </div>
      )}

      {pending.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm dark:shadow-gray-900/30">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((a) => (
            <div key={a.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30 border-l-4 border-amber-400 dark:border-amber-500">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Parent</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{a.parentName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{a.parentEmail}</p>
                  {a.parentPhone && <p className="text-sm text-gray-600 dark:text-gray-300">{a.parentPhone}</p>}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{a.studentName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Age: {a.studentAge} | Grade: {a.studentGrade}</p>
                </div>
              </div>
              {a.message && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded"><strong>Note:</strong> {a.message}</p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Submitted: {new Date(a.createdAt).toLocaleDateString()}</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleAction(a.id, 'approve')}
                  disabled={processing === a.id}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {processing === a.id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleAction(a.id, 'reject')}
                  disabled={processing === a.id}
                  className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-950/60 disabled:opacity-50 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">History</h2>
          <div className="space-y-3">
            {history.map((a) => (
              <div key={a.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-gray-900/30 border-l-4 border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{a.studentName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{a.parentName} ({a.parentEmail})</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    a.status === 'Approved' ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                  }`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
