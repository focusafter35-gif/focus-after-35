import { useState } from 'react'
import { storage } from '../lib/storage.js'
import { generateWeeklyPlan } from '../lib/ai.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { weekdayNames } from '../lib/dates.js'

export default function PlanPage() {
  const { t, lang } = useLanguage()
  const dayLabels = weekdayNames(lang)
  const [profile] = useState(() => storage.getProfile())
  const [draft, setDraft] = useState(() => storage.getPlan())
  const [loading, setLoading] = useState(false)
  const [fallbackNotice, setFallbackNotice] = useState(false)

  async function regenerate() {
    setLoading(true)
    setFallbackNotice(false)
    const result = await generateWeeklyPlan(profile, lang)
    setDraft({ days: result.days })
    setFallbackNotice(result.source === 'fallback')
    setLoading(false)
  }

  function updateTask(dayIdx, taskIdx, value) {
    setDraft((d) => {
      const days = d.days.map((day, i) =>
        i !== dayIdx ? day : { ...day, tasks: day.tasks.map((t2, j) => (j === taskIdx ? value : t2)) }
      )
      return { ...d, days }
    })
  }

  function removeTask(dayIdx, taskIdx) {
    setDraft((d) => {
      const days = d.days.map((day, i) =>
        i !== dayIdx ? day : { ...day, tasks: day.tasks.filter((_, j) => j !== taskIdx) }
      )
      return { ...d, days }
    })
  }

  function addTask(dayIdx) {
    setDraft((d) => {
      const days = d.days.map((day, i) => (i !== dayIdx ? day : { ...day, tasks: [...day.tasks, ''] }))
      return { ...d, days }
    })
  }

  function approve() {
    const cleaned = { days: draft.days.map((d) => ({ ...d, tasks: d.tasks.filter((t2) => t2.trim()) })) }
    storage.setPlan(cleaned)
    setDraft(cleaned)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold brand">{t('plan.title')}</h1>
          <p className="text-muted mt-1 text-sm">{t('plan.subtitle')}</p>
        </div>
        <button type="button" className="btn-secondary whitespace-nowrap" onClick={regenerate} disabled={loading}>
          {loading ? t('plan.thinking') : draft ? t('plan.suggestAgain') : t('plan.suggest')}
        </button>
      </div>

      {fallbackNotice && (
        <div className="rounded-xl border border-warn/40 bg-warnSoft px-4 py-3 text-sm text-warn">
          {t('plan.fallbackNotice')}
        </div>
      )}

      {!draft && !loading && <div className="card p-10 text-center text-muted">{t('plan.empty')}</div>}

      {draft && (
        <div className="space-y-4">
          {draft.days.map((day, dayIdx) => (
            <div key={dayIdx} className="card p-5">
              <h3 className="font-semibold text-accent mb-3">{dayLabels[dayIdx]}</h3>
              <ul className="space-y-2">
                {day.tasks.map((task, taskIdx) => (
                  <li key={taskIdx} className="flex items-center gap-2">
                    <input
                      className="input"
                      value={task}
                      onChange={(e) => updateTask(dayIdx, taskIdx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="text-muted hover:text-warn px-2"
                      onClick={() => removeTask(dayIdx, taskIdx)}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="text-accent text-sm mt-2 hover:underline" onClick={() => addTask(dayIdx)}>
                {t('plan.addTask')}
              </button>
            </div>
          ))}

          <button type="button" className="btn-primary w-full justify-center" onClick={approve}>
            {t('plan.approve')}
          </button>
        </div>
      )}
    </div>
  )
}
