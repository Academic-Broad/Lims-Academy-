'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@/lib/roles'

interface Payment {
  id: string
  invoiceNo: string
  amount: number
  paidAmount: number
  description: string
  status: string
  dueDate: string | null
  paidAt: string | null
  student: { firstName: string; lastName: string; grade: string }
}

export default function PaymentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<{ invoiceNo: string; receiptHtml: string } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== Role.PARENT) router.push('/admin/dashboard')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPayments()
    }
  }, [status, session])

  async function fetchPayments() {
    try {
      const res = await fetch('/api/payments')
      const data = await res.json()
      setPayments(data.payments || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handlePay(paymentId: string) {
    setPaying(paymentId)
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment failed')

      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: data.reference }),
      })
      const verifyData = await verifyRes.json()
      if (verifyData.success) {
        setReceipt(verifyData.payment)
        await fetchPayments()
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setPaying(null)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
  }

  const pendingPayments = payments.filter((p) => p.status === 'Pending')
  const paidPayments = payments.filter((p) => p.status === 'Paid')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Payments</h1>

      {receipt && (
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-green-700 dark:text-green-300 mb-2">Payment Successful!</h2>
          <p className="text-green-600 dark:text-green-400 text-sm mb-4">Receipt has been emailed to you.</p>
          <div dangerouslySetInnerHTML={{ __html: receipt.receiptHtml }} />
          <button
            onClick={() => setReceipt(null)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
          >
            Close
          </button>
        </div>
      )}

      {pendingPayments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Outstanding Fees</h2>
          <div className="space-y-3">
            {pendingPayments.map((p) => (
              <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30 border-l-4 border-amber-400 dark:border-amber-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{p.student.firstName} {p.student.lastName} - {p.student.grade}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Invoice: {p.invoiceNo}</p>
                    {p.dueDate && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">Due: {new Date(p.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-400">₦{p.amount.toLocaleString()}</p>
                    <button
                      onClick={() => handlePay(p.id)}
                      disabled={paying === p.id}
                      className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {paying === p.id ? 'Processing...' : 'Pay Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {paidPayments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Payment History</h2>
          <div className="space-y-2">
            {paidPayments.map((p) => (
              <div key={p.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-gray-900/30 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{p.student.firstName} {p.student.lastName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 dark:text-green-400">₦{p.paidAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {payments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm dark:shadow-gray-900/30">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No payment records found.</p>
        </div>
      )}
    </div>
  )
}
