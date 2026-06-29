'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Role } from '@/lib/roles'

interface DashboardData {
  stats: {
    totalStudents: number
    totalParents: number
    pendingApprovals: number
    totalRevenue: number
  }
  recentPayments: Array<{
    id: string
    invoiceNo: string
    paidAmount: number
    student: { firstName: string; lastName: string }
    parent: { name: string }
    paidAt: string
  }>
  recentMessages: Array<{
    id: string
    name: string
    email: string
    subject: string | null
    message: string
    createdAt: string
  }>
}

const statCards = [
  { label: 'Total Students', key: 'totalStudents' as const, color: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300' },
  { label: 'Total Parents', key: 'totalParents' as const, color: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300' },
  { label: 'Pending Approvals', key: 'pendingApprovals' as const, color: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300' },
  { label: 'Revenue (₦)', key: 'totalRevenue' as const, color: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300', format: true },
]

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== Role.ADMIN) router.push('/parent/dashboard')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/admin/dashboard')
        .then((r) => r.json())
        .then(setData)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [status, session])

  if (status === 'loading' || loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
  }

  if (!data) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.key} className={`rounded-xl p-6 border ${stat.color}`}>
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
            <p className="text-3xl font-bold">
              {stat.format ? data.stats[stat.key].toLocaleString() : data.stats[stat.key]}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/users/create" className="block bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/60 transition font-medium">
              + Create Parent & Student (Manual)
            </Link>
            <Link href="/admin/approvals" className="block bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 p-3 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-950/60 transition font-medium">
              Pending Approvals ({data.stats.pendingApprovals})
            </Link>
            <Link href="/admin/messages" className="block bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 p-3 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/60 transition font-medium">
              View Messages ({data.recentMessages.length} unread)
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Payments</h2>
          {data.recentPayments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No payments yet</p>
          ) : (
            <div className="space-y-3">
              {data.recentPayments.map((p) => (
                <div key={p.id} className="border-b dark:border-gray-700 pb-2 text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{p.parent.name} - {p.student.firstName} {p.student.lastName}</p>
                  <p className="text-green-600 dark:text-green-400">₦{p.paidAmount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Messages</h2>
        {data.recentMessages.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No messages</p>
        ) : (
          <div className="space-y-3">
            {data.recentMessages.map((m) => (
              <div key={m.id} className="border-b dark:border-gray-700 pb-3">
                <p className="font-medium text-gray-900 dark:text-gray-100">{m.name} ({m.email})</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{m.subject && <strong>{m.subject}: </strong>}{m.message.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
