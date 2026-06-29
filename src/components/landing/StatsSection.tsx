const STATS = [
  { value: '500+', label: 'Students Enrolled', icon: '🎓', color: 'from-blue-500 to-cyan-500' },
  { value: '50+', label: 'Expert Educators', icon: '👩‍🏫', color: 'from-purple-500 to-pink-500' },
  { value: '98%', label: 'Success Rate', icon: '🏆', color: 'from-amber-500 to-orange-500' },
  { value: '25+', label: 'Extracurriculars', icon: '⚡', color: 'from-green-500 to-emerald-500' },
]

export function StatsSection() {
  return (
    <section className="relative -mt-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <span className="text-3xl sm:text-4xl">{stat.icon}</span>
            <p className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
