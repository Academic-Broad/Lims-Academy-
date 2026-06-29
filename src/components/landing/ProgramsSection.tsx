import Link from 'next/link'

const PROGRAMS = [
  {
    title: 'Early Childhood',
    ages: 'Ages 3-5',
    desc: 'A nurturing play-based environment that sparks curiosity, creativity, and social development.',
    icon: '🧸',
    tags: ['Play-Based', 'Creative Arts', 'Social Skills'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Elementary School',
    grades: 'Grades 1-5',
    desc: 'Building strong academic foundations with personalized attention in literacy, math, and science.',
    icon: '📖',
    tags: ['Core Academics', 'STEM', 'Music & Arts'],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Secondary School',
    grades: 'Grades 6-12',
    desc: 'Rigorous college-preparatory curriculum with advanced placement, leadership, and career pathways.',
    icon: '🚀',
    tags: ['Advanced Placement', 'Leadership', 'College Prep'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'STEM Academy',
    grades: 'All Grades',
    desc: 'Hands-on science, technology, engineering, and math programs with modern lab facilities.',
    icon: '🔬',
    tags: ['Robotics', 'Coding', 'Lab Experiments'],
    color: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Sports & Athletics',
    grades: 'All Grades',
    desc: 'Comprehensive athletic programs building teamwork, discipline, and physical wellness.',
    icon: '⚽',
    tags: ['Football', 'Swimming', 'Athletics'],
    color: 'from-green-500 to-lime-500',
  },
  {
    title: 'Arts & Culture',
    grades: 'All Grades',
    desc: 'Creative expression through music, drama, visual arts, and cultural appreciation programs.',
    icon: '🎨',
    tags: ['Music', 'Drama', 'Visual Arts'],
    color: 'from-rose-500 to-red-500',
  },
]

export function ProgramsSection() {
  return (
    <section id="programs" className="relative py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 rounded-full mb-4">
            Our Programs
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            A Program for{' '}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Every Passion
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            From early childhood through secondary education, we offer a comprehensive curriculum that nurtures every facet of a child&apos;s potential.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PROGRAMS.map((prog) => (
            <div
              key={prog.title}
              className="group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${prog.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <span className="inline-block text-3xl sm:text-4xl mb-4">{prog.icon}</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{prog.title}</h3>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">{prog.ages || prog.grades}</p>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">{prog.desc}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {prog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all duration-200"
          >
            View Full Curriculum
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
