# LIMS Academy

A school management system built with Next.js, featuring parent and admin portals for managing students, payments, enrollments, and communications.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Authentication:** NextAuth.js (Credentials provider, JWT strategy)
- **Database:** SQLite via Prisma ORM
- **Styling:** Tailwind CSS
- **Email:** Nodemailer (Resend/SMTP)
- **Payments:** Flutterwave integration
- **PDF:** jsPDF for receipts

## Features

### Public
- Landing page with school info and testimonials
- Online admission application
- Contact form
- Forgot/Reset password flow

### Parent Portal
- Dashboard with student overview
- Make payments via Paystack
- View payment history and download receipts
- Change password

### Admin Portal
- Dashboard with stats and quick actions
- Approve/reject enrollment applications
- Create parent+student accounts manually
- Manage fee categories
- View and respond to contact messages
- Change password and email

## Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client and push schema
npm run db:push

# Seed the database (creates admin account)
npm run db:seed

# Start development server
npm run dev
```

## Environment Variables

Copy `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite database path (default: `file:./dev.db`) |
| `NEXTAUTH_SECRET` | Secret for JWT encryption |
| `NEXTAUTH_URL` | App URL (e.g., `http://localhost:3000`) |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `FROM_EMAIL` | Sender email address |
| `ADMIN_EMAIL` | Admin notification email |
| `FLW_PUBLIC_KEY` | Flutterwave public key |
| `FLW_SECRET_KEY` | Flutterwave secret key |
| `FLW_ENCRYPTION_KEY` | Flutterwave encryption key |

## Default Admin

After seeding, the default admin is created with:
- Email: `admin@limsacademy.edu`
- Password: `admin123`

## Project Structure

```
src/
  app/
    (public)/       # Public pages (landing, login, admissions, etc.)
    (dashboard)/    # Authenticated pages (parent & admin portals)
    api/            # API routes (auth, admin, payments, etc.)
  components/       # Shared components
  lib/              # Utilities (auth, email, prisma, roles)
prisma/
  schema.prisma     # Database schema
  seed.js           # Database seeder
```
