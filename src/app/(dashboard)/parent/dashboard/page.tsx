'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Role } from '@/lib/roles'

const PaymentModal = dynamic(() => import('@/components/PaymentModal').then(m => ({ default: m.PaymentModal })), { ssr: false })
const PaymentHistoryTable = dynamic(() => import('@/components/PaymentHistoryTable').then(m => ({ default: m.PaymentHistoryTable })), { ssr: false })

interface Payment {
  id: string
  invoiceNo: string
  amount: number
  paidAmount: number
  description: string
  feeType: string
  paymentMethod?: string | null
  status: string
  dueDate: string | null
  paidAt: string | null
  createdAt: string
  student: {
    id: string
    firstName: string
    lastName: string
    grade: string
  }
  parent?: {
    name: string
  }
}

interface Student {
  id: string
  firstName: string
  lastName: string
  age: number
  grade: string
  relationship: string
  payments: Payment[]
}

export default function ParentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paySuccess, setPaySuccess] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== Role.PARENT) router.push('/admin/dashboard')
  }, [status])

  async function fetchData() {
    try {
      const [studentsRes, paymentsRes] = await Promise.all([
        fetch('/api/parent/students'),
        fetch('/api/payments'),
      ])
      const studentsData = await studentsRes.json()
      const paymentsData = await paymentsRes.json()
      setStudents(studentsData.students || [])
      setPayments(paymentsData.payments || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData()
    }
  }, [status])

  function handlePaymentSuccess() {
    setPaySuccess(true)
    setShowPaymentModal(false)
    fetchData()
    setTimeout(() => setPaySuccess(false), 5000)
  }

  const totalOutstanding = payments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + (p.amount - p.paidAmount), 0)

  const totalPaid = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.paidAmount, 0)

  const totalBilled = payments.reduce((sum, p) => sum + p.amount, 0)

  const [msgForm, setMsgForm] = useState({ subject: '', message: '' })
  const [msgSubmitting, setMsgSubmitting] = useState(false)
  const [msgDone, setMsgDone] = useState(false)
  const [msgError, setMsgError] = useState('')

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault()
    setMsgSubmitting(true)
    setMsgError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          subject: msgForm.subject,
          message: msgForm.message,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send')
      }
      setMsgDone(true)
      setMsgForm({ subject: '', message: '' })
    } catch (err: unknown) {
      setMsgError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setMsgSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome, {session?.user?.name}</p>
        </div>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          Make a Payment
        </button>
      </div>

      {paySuccess && (
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-700 dark:text-green-300 font-medium">Payment successful! Receipt is available in the history below.</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">My Students</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{students.length}</p>
          <div className="mt-2 space-y-1">
            {students.map((s) => (
              <p key={s.id} className="text-sm text-gray-600 dark:text-gray-300">
                {s.firstName} {s.lastName} &middot; Grade {s.grade}
              </p>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Paid</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">₦{totalPaid.toLocaleString()}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Out of ₦{totalBilled.toLocaleString()} billed</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Outstanding Balance</p>
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-400 mt-1">₦{totalOutstanding.toLocaleString()}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Due for {payments.filter(p => p.status === 'Pending').length} invoice(s)</p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No students linked to your account yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Contact the school administration if you believe this is an error.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Students Overview</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {students.map((student) => {
                const outstanding = student.payments
                  .filter((p) => p.status === 'Pending')
                  .reduce((sum, p) => sum + (p.amount - p.paidAmount), 0)

                return (
                  <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Grade {student.grade} &middot; Age {student.age} &middot; ID: {student.id.slice(0, 8)}
                        </p>
                      </div>
                      <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                        outstanding > 0 ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' : 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300'
                      }`}>
                        {outstanding > 0 ? `₦${outstanding.toLocaleString()} Due` : 'Clear'}
                      </span>
                    </div>
                    {student.payments.length > 0 && (
                      <div className="border-t dark:border-gray-700 pt-3 space-y-1.5">
                        {student.payments.slice(0, 3).map((p) => (
                          <div key={p.id} className="flex justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-300">
                              <span className="font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-1.5 py-0.5 rounded mr-1">{p.feeType}</span>
                              {p.description}
                            </span>
                            <span className={p.status === 'Paid' ? 'text-green-600 dark:text-green-400 font-medium' : 'text-amber-600 dark:text-amber-400 font-medium'}>
                              ₦{p.amount.toLocaleString()} &middot; {p.status}
                            </span>
                          </div>
                        ))}
                        {student.payments.length > 3 && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">+{student.payments.length - 3} more</p>
                        )}
                      </div>
                    )}
                    {outstanding > 0 && (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Pay ₦{outstanding.toLocaleString()} Outstanding
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Payment History</h2>
            <PaymentHistoryTable payments={payments} parentName={session?.user?.name} />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Message the School</h2>
        {msgDone ? (
          <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg p-6 text-green-700 dark:text-green-300">
            <p className="font-bold text-lg mb-2">Message Sent!</p>
            <p>The school will get back to you shortly.</p>
            <button onClick={() => setMsgDone(false)} className="mt-4 text-green-600 dark:text-green-400 underline hover:no-underline">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Subject</label>
              <input type="text" value={msgForm.subject} onChange={(e) => setMsgForm({ ...msgForm, subject: e.target.value })}
                className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Message *</label>
              <textarea required rows={4} value={msgForm.message} onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
                className="w-full border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-y" />
            </div>
            {msgError && <p className="text-red-600 dark:text-red-400 text-sm">{msgError}</p>}
            <button type="submit" disabled={msgSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
              {msgSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>

      {showPaymentModal && (
        <PaymentModal
          students={students}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
