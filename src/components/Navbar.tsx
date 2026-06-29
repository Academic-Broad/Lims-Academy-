'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Role } from '@/lib/roles'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
  { href: '/#programs', label: 'Programs' },
  { href: '/#programs', label: 'Programs' },
  { href: '/admissions', label: 'Admissions' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.04)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-all duration-300 group-hover:scale-105">
              LA
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
              LIMS <span className="text-blue-600 dark:text-blue-400">Academy</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {session ? (
              <>
                <Link
                  href={session.user.role === Role.ADMIN ? '/admin/dashboard' : '/parent/dashboard'}
                  className="text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-slate-400 dark:text-slate-500">{session?.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Portal Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 dark:border-slate-700 mt-2 pt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3 px-4">
              <ThemeToggle />
              {session ? (
                <>
                  <Link
                  href={session?.user?.role === Role.ADMIN ? '/admin/dashboard' : '/parent/dashboard'}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400"
                  >
                    Dashboard
                  </Link>
                  <button onClick={() => signOut()} className="text-sm text-red-600 dark:text-red-400">Sign Out</button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-600/30"
                >
                  Portal Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
