'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Role } from '@/lib/roles'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/approvals', label: 'Approvals' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/fee-categories', label: 'Fee Categories' },
  { href: '/admin/users/create', label: 'Create User' },
  { href: '/admin/students', label: 'Students' },
  { href: '/admin/change-password', label: 'Change Password' },
  { href: '/admin/change-email', label: 'Change Email' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session.user.role !== Role.ADMIN) router.push('/parent/dashboard')
  }, [status, session, router])

  if (status === 'loading') return null
  if (!session || session.user.role !== Role.ADMIN) return null

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <aside className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b dark:border-gray-800">
          <Link href="/admin/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            LIMS Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname === item.href
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">{session.user.name}</p>
          <Link href="/" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2">
            View Site
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full text-left text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 md:hidden">
          <div className="flex items-center justify-between px-4 h-16">
            <Link href="/admin/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              LIMS Admin
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-blue-600 dark:text-blue-400">Site</Link>
              <button onClick={() => signOut()} className="text-sm text-red-600 dark:text-red-400">Sign Out</button>
            </div>
          </div>
        </header>

        <div className="md:hidden bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 py-2 flex gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                pathname === item.href
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
