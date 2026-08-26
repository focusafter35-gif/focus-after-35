import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function EveningCheckIn({ savedAnswer, onSave, recentEntries }) {
  const { t } = useLanguage()
  const [value, setValue] = useState(savedAnswer || '')
  const [editing, setEditing] = useState(!savedAnswer)

  function submit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onSave(value.trim())
    setEditing(false)
  }

  return (
    <div className="card p-5">
      <h2 className="font-semibold mb-1">{t('evening.title')}</h2>
      <p className="text-xs text-muted mb-3">{t('evening.subtitle')}</p>

      {editing ? (
        <form onSubmit={submit} className="flex gap-2">
          <input className="input" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
          <button type="submit" className="btn-primary whitespace-nowrap" disabled={!value.trim()}>
            {t('evening.save')}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-full text-start rounded-xl border border-accent/30 bg-accentSoft px-4 py-3 text-sm text-ink"
        >
          {savedAnswer} <span className="text-accent">{t('evening.edit')}</span>
        </button>
      )}

      {recentEntries?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted mb-2">{t('evening.recent')}</p>
          <ul className="space-y-1.5">
            {recentEntries.map((e) => (
              <li key={e.date} className="text-xs text-muted flex gap-2">
                <span className="text-muted/70">{e.date}</span>
                <span>{e.answer}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
