import Link from 'next/link'

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#programs', label: 'Programs' },
  { href: '/admissions', label: 'Admissions' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/login', label: 'Parent Portal' },
]

const PROGRAMS = [
  { href: '/admissions', label: 'Early Childhood' },
  { href: '/admissions', label: 'Elementary School' },
  { href: '/admissions', label: 'Secondary School' },
  { href: '/admissions', label: 'STEM Academy' },
  { href: '/admissions', label: 'Sports & Arts' },
]

export function Footer() {
  return (
    <footer className="relative bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.06)_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                LA
              </div>
              <span className="text-lg font-bold text-white">
                LIMS <span className="text-blue-400">Academy</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Excellence in education, nurturing tomorrow&apos;s leaders. Providing world-class education from Pre-K through Grade 12.
            </p>
            <div className="flex gap-3 mt-6">
              {['📘', '🐦', '📷', '▶️'].map((icon, i) => (
                <span
                  key={i}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-500/20 flex items-center justify-center text-lg cursor-pointer transition-colors"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Programs</h4>
            <ul className="space-y-3">
              {PROGRAMS.map((prog, i) => (
                <li key={i}>
                  <Link href={prog.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    {prog.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <span className="mt-0.5">📍</span>
                <span>No 2 Imo Street, Narayi, <br />Kaduna, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <span>📧</span>
                <a href="mailto:limsreadinghub1@gmail.com" className="hover:text-blue-400 transition-colors">limsreadinghub1@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span>📞</span>
                <a href="tel:+2347011092746" className="hover:text-blue-400 transition-colors">+234 7011092746</a>
              </li>
              <li className="flex items-center gap-3">
                <span>🕐</span>
                <span>Thur– Sat: 7:30 AM – 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} LIMS Academy. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
