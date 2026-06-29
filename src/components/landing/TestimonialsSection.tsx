const TESTIMONIALS = [
  {
    quote: 'LIMS Academy has transformed our child into a confident, curious learner. The teachers are exceptional and truly care about each student\'s growth.',
    name: 'Mrs. Adebayo',
    child: 'Parent of Ayomide, Grade 4',
    rating: 5,
  },
  {
    quote: 'The academic standards and character development at LIMS are outstanding. Enrolling our children here was the best educational decision we\'ve made.',
    name: 'Mr. & Mrs. Okonkwo',
    child: 'Parents of Chidera & Kene, Grades 7 & 9',
    rating: 5,
  },
  {
    quote: 'My daughter has thrived beyond our expectations. The small class sizes and individualized attention have made all the difference in her confidence.',
    name: 'Dr. Okafor',
    child: 'Parent of Nneka, Grade 10',
    rating: 5,
  },
  {
    quote: 'The STEM program at LIMS is world-class. My son built his first robot in Grade 6. The opportunities here are incredible.',
    name: 'Engr. Bello',
    child: 'Parent of Ibrahim, Grade 8',
    rating: 5,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: rating }, (_, i) => (
        <svg key={i} className="w-4 h-4 fill-blue-400 text-blue-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ name, className }: { name: string; className?: string }) {
  const initial = name.charAt(0)
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-green-500 to-emerald-500',
  ]
  const color = colors[name.length % colors.length]
  return (
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg shadow-lg ${className || ''}`}>
      {initial}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-white dark:bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.05)_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            What Parents{' '}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Real stories from the families who trust us with their children&apos;s education.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="group relative p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <StarRating rating={t.rating} />
              <p className="mt-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Avatar name={t.name} />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.child}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
