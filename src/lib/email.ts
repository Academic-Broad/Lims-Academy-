import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[EMAIL] Would send to ${to}: ${subject}`)
    console.log(`[EMAIL] Body: ${html.substring(0, 200)}...`)
    return { messageId: 'mock-' + Date.now() }
  }
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL || `"LIMS Academy" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
  return info
}

export function getPasswordSetupEmail(name: string, setupLink: string) {
  return {
    subject: 'Welcome to LIMS Academy - Set Your Password',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#2563eb">Welcome to LIMS Academy!</h1>
        <p>Hello ${name},</p>
        <p>A parent account has been created for you. Please click the button below to set your password and access your dashboard.</p>
        <a href="${setupLink}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">Set Your Password</a>
        <p>This link will expire in 48 hours.</p>
        <p>If you did not expect this email, please ignore it.</p>
        <p>Best regards,<br/>LIMS Academy Admin</p>
      </div>
    `,
  }
}

export function getApprovalEmail(name: string, setupLink: string) {
  return {
    subject: 'Your Enrollment at LIMS Academy Has Been Approved',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#2563eb">Enrollment Approved!</h1>
        <p>Hello ${name},</p>
        <p>We are pleased to inform you that your child's enrollment at LIMS Academy has been approved.</p>
        <p>Please click the button below to set up your password and access your parent dashboard.</p>
        <a href="${setupLink}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">Set Up Your Account</a>
        <p>This link will expire in 48 hours.</p>
        <p>Best regards,<br/>LIMS Academy Admin</p>
      </div>
    `,
  }
}

export function getPasswordResetEmail(name: string, resetLink: string) {
  return {
    subject: 'Reset Your Password - LIMS Academy',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#2563eb">Reset Your Password</h1>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the button below to set a new password.</p>
        <a href="${resetLink}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,<br/>LIMS Academy Admin</p>
      </div>
    `,
  }
}

export function getPaymentReceiptEmail(name: string, receiptHtml: string) {
  return {
    subject: 'Payment Receipt - LIMS Academy',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#2563eb">Payment Receipt</h1>
        <p>Hello ${name},</p>
        <p>Thank you for your payment. Please find your receipt below.</p>
        ${receiptHtml}
        <p>Best regards,<br/>LIMS Academy</p>
      </div>
    `,
  }
}
