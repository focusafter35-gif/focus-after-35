import { useLanguage } from '../i18n/LanguageContext.jsx'

const LEVELS = [
  { key: 'low', labelKey: 'energy.low', emoji: '🌧️' },
  { key: 'medium', labelKey: 'energy.medium', emoji: '⛅' },
  { key: 'high', labelKey: 'energy.high', emoji: '☀️' },
]

export default function EnergyCheckIn({ onSelect }) {
  const { t } = useLanguage()

  return (
    <div className="card p-5">
      <h2 className="font-semibold mb-3">{t('energy.title')}</h2>
      <p className="text-xs text-muted mb-3">{t('energy.subtitle')}</p>
      <div className="grid grid-cols-3 gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => onSelect(l.key)}
            className="rounded-xl border border-border hover:border-accent hover:bg-accentSoft py-4 flex flex-col items-center gap-1 transition-colors"
          >
            <span className="text-2xl">{l.emoji}</span>
            <span className="text-sm">{t(l.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export { LEVELS }
