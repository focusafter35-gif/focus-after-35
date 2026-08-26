import { useTheme } from '../theme/ThemeContext.jsx'
import { THEMES } from '../theme/themes.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {THEMES.map((th) => (
        <button
          key={th.id}
          type="button"
          onClick={() => setTheme(th.id)}
          className={`text-start rounded-xl border p-3 transition-colors ${
            theme === th.id ? 'border-accent ring-2 ring-accentSoft' : 'border-border hover:bg-surfaceMuted'
          }`}
        >
          <div className="flex h-10 rounded-lg overflow-hidden mb-2 border border-border">
            {th.swatch.map((c, i) => (
              <span key={i} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
          <p className="text-sm font-medium">{t(th.nameKey)}</p>
          <p className="text-xs text-muted mt-0.5">{t(th.descKey)}</p>
        </button>
      ))}
    </div>
  )
}
