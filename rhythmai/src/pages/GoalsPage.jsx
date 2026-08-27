import { useEffect, useState } from 'react'
import { db } from '../lib/db.js'
import { breakdownGoal } from '../lib/ai.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export default function GoalsPage() {
  const { t, lang } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [goals, setGoals] = useState([])
  const [title, setTitle] = useState('')
  const [why, setWhy] = useState('')
  const [saving, setSaving] = useState(false)
  const [fallbackNotice, setFallbackNotice] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([db.getProfile(), db.getGoals()]).then(([p, g]) => {
      if (cancelled) return
      setProfile(p)
      setGoals(g)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  function persist(next) {
    setGoals(next)
    db.setGoals(next).catch(() => {})
  }

  async function addGoal(e) {
    e.preventDefault()
    if (!title.trim() || saving) return
    setSaving(true)
    setFallbackNotice(false)
    const result = await breakdownGoal(title.trim(), why.trim(), profile, lang)
    const goal = {
      id: uid(),
      title: title.trim(),
      why: why.trim(),
      steps: result.steps.map((text) => ({ id: uid(), text, done: false })),
      createdAt: new Date().toISOString(),
    }
    persist([goal, ...goals])
    setFallbackNotice(result.source === 'fallback')
    setTitle('')
    setWhy('')
    setSaving(false)
  }

  function toggleStep(goalId, stepId) {
    persist(
      goals.map((g) =>
        g.id !== goalId
          ? g
          : { ...g, steps: g.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)) }
      )
    )
  }

  function deleteGoal(goalId) {
    if (!confirm(t('goals.delete') + '?')) return
    persist(goals.filter((g) => g.id !== goalId))
  }

  if (loading) return <div className="text-center text-muted py-16">…</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold brand">{t('goals.title')}</h1>
        <p className="text-muted mt-1 text-sm">{t('goals.subtitle')}</p>
      </div>

      <form onSubmit={addGoal} className="card p-5 space-y-3">
        <div>
          <label className="label">{t('goals.goalLabel')}</label>
          <input
            className="input"
            placeholder={t('goals.goalPlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label">{t('goals.whyLabel')}</label>
          <input className="input" value={why} onChange={(e) => setWhy(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary" disabled={!title.trim() || saving}>
          {saving ? t('goals.planning') : t('goals.add')}
        </button>
        {fallbackNotice && <p className="text-xs text-warn">{t('goals.fallbackNotice')}</p>}
      </form>

      <div className="space-y-4">
        {goals.map((goal) => {
          const doneCount = goal.steps.filter((s) => s.done).length
          return (
            <div key={goal.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h3 className="font-semibold text-accent">{goal.title}</h3>
                  {goal.why && <p className="text-xs text-muted mt-0.5">{goal.why}</p>}
                </div>
                <button
                  type="button"
                  className="text-muted hover:text-warn text-sm"
                  onClick={() => deleteGoal(goal.id)}
                >
                  {t('goals.delete')}
                </button>
              </div>

              <div className="h-1.5 rounded-full bg-accentSoft mt-3 mb-3 overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${goal.steps.length ? (doneCount / goal.steps.length) * 100 : 0}%` }}
                />
              </div>

              <ul className="space-y-2">
                {goal.steps.map((step) => (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => toggleStep(goal.id, step.id)}
                      className={`w-full text-start flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${
                        step.done
                          ? 'border-accent/30 bg-accentSoft text-muted line-through'
                          : 'border-border hover:bg-surfaceMuted'
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${
                          step.done ? 'bg-accent border-accent' : 'border-border'
                        }`}
                      />
                      {step.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
        {goals.length === 0 && <div className="text-center text-muted py-10">{t('goals.empty')}</div>}
      </div>
    </div>
  )
}
