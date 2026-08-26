import { NavLink, Outlet } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'

export default function Layout() {
  const { t } = useLanguage()

  const links = [
    { to: '/', label: t('nav.today'), end: true },
    { to: '/goals', label: t('nav.goals') },
    { to: '/plan', label: t('nav.plan') },
    { to: '/research', label: t('nav.research') },
    { to: '/settings', label: t('nav.settings') },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-accent text-lg brand">
            <span className="inline-block h-7 w-7 rounded-full bg-accent" />
            RhythmAI
          </NavLink>
          <nav className="flex gap-1 flex-wrap">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-accentSoft text-accent' : 'text-muted hover:bg-surfaceMuted'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <LanguageSwitcher compact />
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-muted py-6">{t('common.tagline')}</footer>
    </div>
  )
}
