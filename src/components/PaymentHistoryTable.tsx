'use client'

const METHOD_LABELS: Record<string, string> = {
  card: 'Card',
  bank_transfer: 'Bank Transfer',
  ussd: 'USSD',
  mobile_money: 'Mobile Money',
  qr: 'QR',
}

interface PaymentRecord {
  id: string
  invoiceNo: string
  amount: number
  paidAmount: number
  description: string
  feeType: string
  paymentMethod?: string | null
  status: string
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

interface PaymentHistoryTableProps {
  payments: PaymentRecord[]
  parentName?: string
}

export function PaymentHistoryTable({ payments, parentName }: PaymentHistoryTableProps) {
  const paid = payments.filter((p) => p.status === 'Paid')
  const pending = payments.filter((p) => p.status === 'Pending')

  async function handleDownloadReceipt(p: PaymentRecord) {
    const { generateReceiptPdf } = await import('@/lib/payments/pdfReceipt')
    generateReceiptPdf({
      invoiceNo: p.invoiceNo,
      studentName: `${p.student.firstName} ${p.student.lastName}`,
      studentGrade: p.student.grade,
      studentId: p.student.id,
      feeType: p.feeType,
      description: p.description,
      amount: p.amount,
      paidAmount: p.paidAmount,
      paymentMethod: p.paymentMethod,
      paidAt: p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A',
      parentName: parentName || '',
    })
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No payment records found.</p>
        <p className="text-sm mt-1">Payments you make will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Pending / Outstanding</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Purpose</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {pending.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.student.firstName} {p.student.lastName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      <span className="text-xs font-medium bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded mr-1">{p.feeType}</span>
                      {p.description}
                    </td>
                    <td className="px-4 py-3 font-medium text-amber-700 dark:text-amber-400">₦{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-medium px-2.5 py-1 rounded-full">Pending</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {paid.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Payment History</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Purpose</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Method</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Reference</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {paid.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.student.firstName} {p.student.lastName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      <span className="text-xs font-medium bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded mr-1">{p.feeType}</span>
                      {p.description}
                    </td>
                    <td className="px-4 py-3">
                      {p.paymentMethod ? (
                        <span className="text-xs font-medium bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                          {METHOD_LABELS[p.paymentMethod] || p.paymentMethod}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-mono">{p.invoiceNo}</td>
                    <td className="px-4 py-3 font-medium text-green-700 dark:text-green-400">₦{p.paidAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">Paid</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDownloadReceipt(p)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium underline underline-offset-2"
                      >
                        Download Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
