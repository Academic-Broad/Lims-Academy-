import Link from 'next/link'

function TelescopeIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg">
      <defs>
        <linearGradient id="tele-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="tele-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="tele-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="63" cy="12" r="1.5" fill="#fbbf24" opacity="0.8" />
      <circle cx="70" cy="28" r="1" fill="#fbbf24" opacity="0.6" />
      <circle cx="8" cy="15" r="1.5" fill="#22d3ee" opacity="0.8" />
      <circle cx="15" cy="8" r="1" fill="#22d3ee" opacity="0.5" />
      <circle cx="72" cy="8" r="2" fill="#fbbf24" opacity="0.9" />
      <line x1="38" y1="48" x2="22" y2="72" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="48" x2="52" y2="72" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="48" x2="38" y2="74" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="22" y="20" width="32" height="18" rx="9" fill="url(#tele-body)" stroke="#22d3ee" strokeWidth="0.5" opacity="0.9" />
      <ellipse cx="54" cy="29" rx="4.5" ry="8" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="0.8" />
      <ellipse cx="54" cy="29" rx="2" ry="5" fill="#bae6fd" opacity="0.6" />
      <rect x="14" y="25" width="11" height="8" rx="4" fill="url(#tele-metal)" stroke="#cbd5e1" strokeWidth="0.5" />
      <circle cx="38" cy="45" r="4.5" fill="url(#tele-metal)" stroke="#94a3b8" strokeWidth="0.5" />
      <circle cx="38" cy="45" r="2" fill="url(#tele-gold)" />
      <rect x="44" y="47" width="14" height="3" rx="1.5" fill="#64748b" opacity="0.3" />
    </svg>
  )
}

function MasksIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg">
      <defs>
        <linearGradient id="mask-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="mask-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="mask-ribbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <ellipse cx="28" cy="38" rx="16" ry="18" fill="url(#mask-gold)" />
      <ellipse cx="28" cy="38" rx="14" ry="16" fill="#fef3c7" />
      <ellipse cx="24" cy="32" rx="2" ry="2.5" fill="#92400e" />
      <ellipse cx="32" cy="32" rx="2" ry="2.5" fill="#92400e" />
      <path d="M22 42 Q28 48 34 42" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="14" y="10" width="4" height="20" rx="2" fill="url(#mask-ribbon)" transform="rotate(-15 16 20)" />
      <ellipse cx="56" cy="38" rx="16" ry="18" fill="url(#mask-silver)" />
      <ellipse cx="56" cy="38" rx="14" ry="16" fill="#f1f5f9" />
      <ellipse cx="52" cy="32" rx="2" ry="2.5" fill="#475569" />
      <ellipse cx="60" cy="32" rx="2" ry="2.5" fill="#475569" />
      <path d="M52 44 Q56 38 60 44" stroke="#475569" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="60" y="10" width="4" height="20" rx="2" fill="url(#mask-ribbon)" transform="rotate(15 62 20)" />
      <circle cx="28" cy="54" r="5" fill="#fbbf24" opacity="0.3" />
      <circle cx="56" cy="54" r="5" fill="#e2e8f0" opacity="0.3" />
    </svg>
  )
}

function SoccerBallIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg">
      <defs>
        <linearGradient id="ball-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="24" fill="url(#ball-grad)" />
      <circle cx="40" cy="40" r="24" fill="#f0fdf4" />
      <circle cx="40" cy="40" r="24" stroke="#34d399" strokeWidth="1.5" />
      <path d="M40 16 L44 30 L40 34 L36 30 Z" fill="#34d399" opacity="0.6" />
      <path d="M40 16 L48 22 L44 30 Z" fill="#059669" opacity="0.4" />
      <path d="M40 16 L32 22 L36 30 Z" fill="#059669" opacity="0.4" />
      <path d="M44 30 L52 34 L48 42 L40 34 Z" fill="#34d399" opacity="0.5" />
      <path d="M36 30 L28 34 L32 42 L40 34 Z" fill="#34d399" opacity="0.5" />
      <path d="M48 42 L52 50 L44 54 L40 46 Z" fill="#34d399" opacity="0.5" />
      <path d="M32 42 L28 50 L36 54 L40 46 Z" fill="#34d399" opacity="0.5" />
      <path d="M40 34 L44 42 L40 46 L36 42 Z" fill="#34d399" opacity="0.7" />
      <line x1="14" y1="24" x2="6" y2="12" stroke="#34d399" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="30" x2="2" y2="28" stroke="#34d399" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="66" y1="24" x2="74" y2="12" stroke="#34d399" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="68" y1="30" x2="78" y2="28" stroke="#34d399" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="40" y1="64" x2="40" y2="74" stroke="#34d399" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

function BooksIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg">
      <defs>
        <linearGradient id="book-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <linearGradient id="book-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="book-emerald" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="book-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <rect x="18" y="16" width="44" height="10" rx="1.5" fill="url(#book-red)" />
      <line x1="20" y1="20" x2="56" y2="20" stroke="#fda4af" strokeWidth="0.5" opacity="0.4" />
      <rect x="22" y="24" width="44" height="10" rx="1.5" fill="url(#book-blue)" />
      <line x1="24" y1="28" x2="60" y2="28" stroke="#93c5fd" strokeWidth="0.5" opacity="0.4" />
      <rect x="16" y="32" width="48" height="11" rx="1.5" fill="url(#book-emerald)" />
      <line x1="18" y1="36" x2="58" y2="36" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.4" />
      <rect x="20" y="41" width="42" height="10" rx="1.5" fill="url(#book-gold)" />
      <line x1="22" y1="45" x2="56" y2="45" stroke="#fde68a" strokeWidth="0.5" opacity="0.4" />
      <rect x="32" y="8" width="4" height="16" rx="1" fill="#f43f5e" />
      <rect x="36" y="10" width="3" height="14" rx="1" fill="#3b82f6" />
      <rect x="39" y="7" width="3" height="36" rx="1.5" fill="#10b981" />
      <rect x="42" y="9" width="3" height="34" rx="1" fill="#d97706" />
    </svg>
  )
}

function MusicNoteIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg">
      <defs>
        <linearGradient id="music-note" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <linearGradient id="music-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="60" rx="10" ry="7" fill="url(#music-note)" />
      <rect x="39" y="18" width="5" height="42" rx="2.5" fill="url(#music-note)" />
      <ellipse cx="52" cy="55" rx="9" ry="6" fill="url(#music-note)" opacity="0.85" />
      <rect x="39" y="18" width="18" height="5" rx="2.5" fill="url(#music-accent)" />
      <rect x="57" y="18" width="2" height="18" rx="1" fill="#fb7185" opacity="0.6" />
      <rect x="62" y="22" width="2" height="14" rx="1" fill="#f43f5e" opacity="0.5" />
      <rect x="67" y="26" width="2" height="10" rx="1" fill="#fb7185" opacity="0.4" />
      <rect x="72" y="18" width="2" height="22" rx="1" fill="#f43f5e" opacity="0.3" />
      <circle cx="57" cy="55" r="3" fill="#fda4af" opacity="0.5" />
      <circle cx="66" cy="50" r="2" fill="#fda4af" opacity="0.3" />
      <circle cx="70" cy="60" r="1.5" fill="#fda4af" opacity="0.25" />
    </svg>
  )
}

function LaptopIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg">
      <defs>
        <linearGradient id="laptop-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="laptop-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f0d2e" />
        </linearGradient>
      </defs>
      <path d="M18 50 L24 28 L56 28 L62 50 Z" fill="url(#laptop-body)" />
      <path d="M21 48 L26 30 L54 30 L59 48 Z" fill="url(#laptop-screen)" />
      <line x1="28" y1="34" x2="44" y2="34" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="28" y1="38" x2="40" y2="38" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="28" y1="42" x2="46" y2="42" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="28" y1="46" x2="36" y2="46" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="48" cy="36" r="1" fill="#818cf8" opacity="0.5" />
      <circle cx="50" cy="40" r="1" fill="#34d399" opacity="0.5" />
      <rect x="18" y="50" width="44" height="4" rx="2" fill="#4338ca" />
      <rect x="12" y="54" width="56" height="3" rx="1.5" fill="#3730a3" />
      <rect x="35" y="56" width="10" height="3" rx="1" fill="#312e81" />
      <circle cx="14" cy="44" r="1.5" fill="#818cf8" opacity="0.4" />
      <path d="M12 42 L14 44 L12 46" stroke="#818cf8" strokeWidth="0.8" fill="none" opacity="0.3" />
      <circle cx="66" cy="44" r="1.5" fill="#818cf8" opacity="0.4" />
      <path d="M64 42 L66 44 L64 46" stroke="#818cf8" strokeWidth="0.8" fill="none" opacity="0.3" />
    </svg>
  )
}

const CARD_DATA = [
  { icon: TelescopeIcon, label: 'STEM Labs',
    borderClass: 'border-cyan-200 dark:border-cyan-500/20',
    glowClass: 'hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:shadow-cyan-200/50 dark:hover:shadow-cyan-500/10' },
  { icon: MasksIcon, label: 'Performing Arts',
    borderClass: 'border-purple-200 dark:border-purple-500/20',
    glowClass: 'hover:border-purple-400 dark:hover:border-purple-500/50 hover:shadow-purple-200/50 dark:hover:shadow-purple-500/10' },
  { icon: SoccerBallIcon, label: 'Sports Academy',
    borderClass: 'border-emerald-200 dark:border-emerald-500/20',
    glowClass: 'hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:shadow-emerald-200/50 dark:hover:shadow-emerald-500/10' },
  { icon: BooksIcon, label: 'Library',
    borderClass: 'border-amber-200 dark:border-amber-500/20',
    glowClass: 'hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-amber-200/50 dark:hover:shadow-amber-500/10' },
  { icon: MusicNoteIcon, label: 'Music Studio',
    borderClass: 'border-rose-200 dark:border-rose-500/20',
    glowClass: 'hover:border-rose-400 dark:hover:border-rose-500/50 hover:shadow-rose-200/50 dark:hover:shadow-rose-500/10' },
  { icon: LaptopIcon, label: 'Tech Lab',
    borderClass: 'border-indigo-200 dark:border-indigo-500/20',
    glowClass: 'hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-indigo-200/50 dark:hover:shadow-indigo-500/10' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none dark:opacity-100 opacity-[0.3]" />

      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none dark:from-blue-500/8 dark:via-purple-500/5" />
      <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none dark:from-cyan-500/8 dark:via-blue-500/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-soft dark:from-indigo-500/3 dark:via-purple-500/3 dark:to-pink-500/3" />

      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/20 pointer-events-none dark:from-slate-950 dark:via-transparent dark:to-slate-950/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-500/10 dark:bg-blue-500/12 backdrop-blur-sm rounded-full border border-blue-500/30 dark:border-blue-500/25">
              <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse-soft" />
              <span className="text-sm font-semibold text-blue-700 dark:text-white tracking-wide">Now Enrolling for 2026/2027 Session</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-[1.08]">
              Empowering the Next Generation of{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-[length:200%_200%] animate-gradient-text">
                Thinkers &amp; Innovators
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-xl font-light">
              Where academic excellence meets character development. From Pre-K to Grade 12, we nurture curious minds, build confidence, and prepare students for a future without limits.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/45 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Explore Programs
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-slate-600 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-400 dark:hover:border-slate-400/50 hover:text-slate-800 dark:hover:text-white transition-all duration-200"
              >
                Book a Visit
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600 shadow-lg"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-white">Trusted by 500+ Families</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Join our growing community</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-4 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-cyan-500/15 rounded-3xl blur-3xl pointer-events-none dark:from-blue-500/15 dark:via-purple-500/10 dark:to-cyan-500/15" />
            {CARD_DATA.map((card, i) => {
              const Icon = card.icon
              return (
                <div
                  key={i}
                  className={`relative group cursor-pointer ${i >= 3 ? 'translate-y-8' : ''}`}
                  style={{ animation: `float ${6 + i * 0.5}s ease-in-out ${i * 0.5}s infinite` }}
                >
                  <div className={`relative p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm border ${card.borderClass} ${card.glowClass} shadow-lg shadow-slate-200/50 dark:shadow-black/10 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/[0.04] pointer-events-none" />
                    <div className="relative flex flex-col items-center text-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-white/5 shadow-sm">
                        <Icon />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">
                        {card.label}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-slate-950 pointer-events-none" />
    </section>
  )
}
