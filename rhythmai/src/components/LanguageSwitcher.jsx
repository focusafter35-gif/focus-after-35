import { useLanguage } from '../i18n/LanguageContext.jsx'
import { LANGUAGES } from '../i18n/languages.js'

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useLanguage()

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label="Language"
      className={
        compact
          ? 'bg-transparent border border-border rounded-lg px-2 py-1 text-sm text-ink'
          : 'input max-w-xs'
      }
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  )
}
