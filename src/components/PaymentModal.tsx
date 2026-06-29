'use client'

import { useState, useEffect } from 'react'

interface Student {
  id: string
  firstName: string
  lastName: string
  grade: string
  relationship: string
}

interface PaymentModalProps {
  students: Student[]
  onClose: () => void
  onSuccess: () => void
}

type Step = 'select-student' | 'select-category' | 'enter-amount' | 'select-method' | 'confirm'
type PaymentMethod = 'card' | 'bank_transfer' | 'ussd'

const ALL_STEPS: Step[] = ['select-student', 'select-category', 'enter-amount', 'select-method', 'confirm']

const METHOD_OPTIONS: { value: PaymentMethod; label: string; description: string; icon: string }[] = [
  { value: 'card', label: 'Debit / Credit Card', description: 'Pay instantly with your bank card', icon: '💳' },
  { value: 'bank_transfer', label: 'Bank Transfer', description: 'Transfer from your bank account', icon: '🏦' },
  { value: 'ussd', label: 'USSD Code', description: 'Pay via USSD on any phone', icon: '📱' },
]

export function PaymentModal({ students, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<Step>('select-student')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [categories, setCategories] = useState<{ value: string; label: string; description: string | null }[]>([])
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/fee-categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data.filter((c: { isActive: boolean }) => c.isActive))
      })
      .catch(() => {})
  }, [])

  function reset() {
    setStep('select-student')
    setSelectedStudent(null)
    setSelectedCategory('')
    setCustomAmount('')
    setSelectedMethod(null)
    setError('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handlePay() {
    if (!selectedStudent || !selectedCategory || !customAmount || !selectedMethod) return

    setPaying(true)
    setError('')

    try {
      const initRes = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          feeType: selectedCategory,
          amount: parseFloat(customAmount),
          channel: selectedMethod,
          description: `${selectedCategory} - ${selectedStudent.firstName} ${selectedStudent.lastName}`,
        }),
      })
      const initData = await initRes.json()
      if (!initRes.ok) throw new Error(initData.error || 'Payment initialization failed')

      if (initData.authorization_url) {
        const paystackWindow = window.open(initData.authorization_url, '_blank')
        if (paystackWindow) {
          const pollInterval = setInterval(async () => {
            try {
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference: initData.reference }),
              })
              const verifyData = await verifyRes.json()
              if (verifyData.success && verifyData.payment.status === 'Paid') {
                clearInterval(pollInterval)
                setPaying(false)
                reset()
                onSuccess()
              }
            } catch {
              // poll until verified
            }
          }, 3000)
          setTimeout(() => clearInterval(pollInterval), 120000)
        }
      } else if (typeof window !== 'undefined' && initData.public_key) {
        const PaystackPop = (window as any).PaystackPop
        if (PaystackPop) {
          const handler = PaystackPop.setup({
            key: initData.public_key,
            email: '',
            amount: parseFloat(customAmount) * 100,
            ref: initData.reference,
            channels: initData.channels || ['card', 'bank_transfer', 'ussd'],
            onClose: () => {
              setPaying(false)
            },
            callback: async (response: { reference: string }) => {
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference: response.reference }),
              })
              const verifyData = await verifyRes.json()
              if (verifyData.success && verifyData.payment.status === 'Paid') {
                reset()
                onSuccess()
              } else {
                setError('Payment verification failed. Please contact support.')
              }
              setPaying(false)
            },
          })
          handler.openIframe()
        } else {
          setError('Payment gateway unavailable. Please try again.')
          setPaying(false)
        }
      } else {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: initData.reference }),
        })
        const verifyData = await verifyRes.json()
        if (verifyData.success && verifyData.payment.status === 'Paid') {
          reset()
          onSuccess()
        } else {
          setError('Payment processing failed. Please try again.')
        }
        setPaying(false)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setPaying(false)
    }
  }

  function stepIndex(): number {
    return ALL_STEPS.indexOf(step)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Make a Payment</h2>
            <div className="flex gap-1 mt-2">
              {ALL_STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full ${stepIndex() >= i ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-300 text-sm">{error}</div>
          )}

          {step === 'select-student' && (
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">Select Student</label>
              <div className="space-y-2">
                {students.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedStudent(s); setStep('select-category') }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      selectedStudent?.id === s.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40' : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">{s.firstName} {s.lastName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Grade {s.grade} | ID: {s.id.slice(0, 8)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'select-category' && (
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">Payment Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => { setSelectedCategory(cat.value); setStep('enter-amount') }}
                    className={`text-left p-3 rounded-xl border-2 transition ${
                      selectedCategory === cat.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40' : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{cat.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.description}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('select-student')} className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">Back</button>
            </div>
          )}

          {step === 'enter-amount' && (
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Amount (NGN)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">₦</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-10 py-4 text-lg font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              {selectedStudent && selectedCategory && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Paying for: <strong className="text-gray-900 dark:text-white">{selectedStudent.firstName} {selectedStudent.lastName}</strong> &mdash; {categories.find(c => c.value === selectedCategory)?.label}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={() => setStep('select-category')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Back</button>
                <button
                  onClick={() => setStep('select-method')}
                  disabled={!customAmount || parseFloat(customAmount) < 100}
                  className="ml-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 'select-method' && (
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">How would you like to pay?</label>
              <div className="space-y-3">
                {METHOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSelectedMethod(opt.value); setStep('confirm') }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-4 ${
                      selectedMethod === opt.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40' : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{opt.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{opt.description}</p>
                    </div>
                    <span className="ml-auto text-blue-600 text-lg">{selectedMethod === opt.value ? '✓' : ''}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('enter-amount')} className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">Back</button>
            </div>
          )}

          {step === 'confirm' && selectedStudent && selectedCategory && customAmount && selectedMethod && (
            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Confirm Payment</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Student:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedStudent.firstName} {selectedStudent.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Category:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{categories.find(c => c.value === selectedCategory)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Student ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedStudent.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Payment Method:</span>
                  <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    {METHOD_OPTIONS.find(m => m.value === selectedMethod)?.icon}{' '}
                    {METHOD_OPTIONS.find(m => m.value === selectedMethod)?.label}
                  </span>
                </div>
                <div className="border-t dark:border-gray-600 pt-2 flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <span className="font-bold text-lg text-blue-700 dark:text-blue-400">₦{parseFloat(customAmount).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full mt-4 bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {paying ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </button>

              <button onClick={() => setStep('select-method')} className="w-full mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-center">Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
