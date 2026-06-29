import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { Role } from '@/lib/roles'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    if (pathname.startsWith('/admin')) {
      if (token?.role !== Role.ADMIN) {
        return NextResponse.redirect(new URL('/parent/dashboard', req.url))
      }
    }

    if (pathname.startsWith('/parent')) {
      if (token?.role !== Role.PARENT) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/parent/:path*'],
}
