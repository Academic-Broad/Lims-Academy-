import { jsPDF } from 'jspdf'

const METHOD_LABELS: Record<string, string> = {
  card: 'Card',
  bank_transfer: 'Bank Transfer',
  ussd: 'USSD',
  mobile_money: 'Mobile Money',
  qr: 'QR',
}

interface ReceiptData {
  invoiceNo: string
  studentName: string
  studentGrade: string
  studentId: string
  feeType: string
  description: string
  amount: number
  paidAmount: number
  paymentMethod?: string | null
  paidAt: string
  parentName: string
}

export function generateReceiptPdf(data: ReceiptData): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  const primaryColor: [number, number, number] = [37, 99, 235]
  const grayColor: [number, number, number] = [107, 114, 128]

  doc.setFontSize(10)
  doc.setTextColor(...grayColor)
  doc.text('PAYMENT RECEIPT', pageWidth - 20, 20, { align: 'right' })

  doc.setFontSize(24)
  doc.setTextColor(...primaryColor)
  doc.setFont('helvetica', 'bold')
  doc.text('LIMS ACADEMY', 20, 30)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  doc.text('Excellence in Education', 20, 36)

  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(0.5)
  doc.line(20, 40, pageWidth - 20, 40)

  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('OFFICIAL RECEIPT', pageWidth / 2, 55, { align: 'center' })

  const yStart = 70
  const leftCol = 25
  const rightCol = 110
  const rowHeight = 8

  const fields = [
    { label: 'Receipt No:', value: data.invoiceNo },
    { label: 'Student Name:', value: data.studentName },
    { label: 'Grade:', value: data.studentGrade },
    { label: 'Student ID:', value: data.studentId },
    { label: 'Fee Category:', value: data.feeType },
    { label: 'Description:', value: data.description },
    { label: 'Payment Method:', value: data.paymentMethod ? (METHOD_LABELS[data.paymentMethod] || data.paymentMethod) : 'N/A' },
    { label: 'Total Amount:', value: `\u20A6${data.amount.toLocaleString()}` },
    { label: 'Amount Paid:', value: `\u20A6${data.paidAmount.toLocaleString()}` },
    { label: 'Payment Date:', value: data.paidAt },
    { label: 'Parent:', value: data.parentName },
  ]

  doc.setFontSize(9)
  fields.forEach((field, i) => {
    const y = yStart + i * rowHeight
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...grayColor)
    doc.text(field.label, leftCol, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(field.value, rightCol, y)
  })

  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(0.5)
  doc.line(20, yStart + fields.length * rowHeight + 5, pageWidth - 20, yStart + fields.length * rowHeight + 5)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(22, 163, 74)
  doc.text('STATUS: PAID', pageWidth / 2, yStart + fields.length * rowHeight + 18, { align: 'center' })

  const methodLabel = data.paymentMethod ? (METHOD_LABELS[data.paymentMethod] || data.paymentMethod) : null
  if (methodLabel) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text(`Paid via ${methodLabel}`, pageWidth / 2, yStart + fields.length * rowHeight + 26, { align: 'center' })
  }

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  const footerY = methodLabel ? yStart + fields.length * rowHeight + 34 : yStart + fields.length * rowHeight + 26
  doc.text('This is a computer-generated receipt and does not require a physical signature.', pageWidth / 2, footerY, { align: 'center' })
  doc.text('Thank you for your payment.', pageWidth / 2, footerY + 6, { align: 'center' })

  doc.save(`receipt-${data.invoiceNo}.pdf`)

  return doc
}
