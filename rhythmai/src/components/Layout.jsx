import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'

export default function Layout() {
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: t('nav.today'), end: true },
    { to: '/goals', label: t('nav.goals') },
    { to: '/plan', label: t('nav.plan') },
    { to: '/work', label: t('nav.work') },
    { to: '/research', label: t('nav.research') },
    { to: '/report', label: t('nav.report') },
    { to: '/settings', label: t('nav.settings') },
  ]

  function linkClass({ isActive }) {
    return `rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-accentSoft text-accent' : 'text-muted hover:bg-surfaceMuted'
    }`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <NavLink
            to="/"
            className="flex items-center gap-2 font-bold text-accent text-lg brand shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <span className="inline-block h-7 w-7 rounded-full bg-accent" />
            RhythmAI
          </NavLink>

          <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={(s) => `${linkClass(s)} px-3 py-1.5 whitespace-nowrap`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher compact />
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border text-ink"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-border px-4 py-2 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setMenuOpen(false)}
                className={(s) => `${linkClass(s)} px-3 py-2`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-muted py-6">{t('common.tagline')}</footer>
    </div>
  )
}
