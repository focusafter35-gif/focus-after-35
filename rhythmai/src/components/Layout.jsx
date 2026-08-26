import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'اليوم', end: true },
  { to: '/plan', label: 'الخطة' },
  { to: '/research', label: 'ابحث' },
  { to: '/settings', label: 'الإعدادات' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-sage-700 text-lg">
            <span className="inline-block h-7 w-7 rounded-full bg-sage-600" />
            RhythmAI
          </NavLink>
          <nav className="flex gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-sage-100 text-sage-700' : 'text-ink/60 hover:bg-black/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-ink/40 py-6">
        بياناتك تبقى في متصفحك فقط. RhythmAI لا يقدّم استشارات طبية.
      </footer>
    </div>
  )
}
