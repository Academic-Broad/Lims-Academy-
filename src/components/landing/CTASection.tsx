import Link from 'next/link'

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Ready to Join{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
            LIMS Academy
          </span>
          ?
        </h2>
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Begin your child&apos;s journey to academic excellence today. Enrolment for the 2026/2027 session is now open.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all duration-200"
          >
            Start Application
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/20 rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all duration-200"
          >
            Speak with Admissions
          </Link>
        </div>
      </div>
    </section>
  )
}
