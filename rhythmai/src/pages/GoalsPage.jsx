import { useState } from 'react'
import { storage } from '../lib/storage.js'
import { breakdownGoal } from '../lib/ai.js'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export default function GoalsPage() {
  const [profile] = useState(() => storage.getProfile())
  const [goals, setGoals] = useState(() => storage.getGoals())
  const [title, setTitle] = useState('')
  const [why, setWhy] = useState('')
  const [loading, setLoading] = useState(false)
  const [fallbackNotice, setFallbackNotice] = useState(false)

  function persist(next) {
    setGoals(next)
    storage.setGoals(next)
  }

  async function addGoal(e) {
    e.preventDefault()
    if (!title.trim() || loading) return
    setLoading(true)
    setFallbackNotice(false)
    const result = await breakdownGoal(title.trim(), why.trim(), profile)
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
    setLoading(false)
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
    if (!confirm('حذف هذا الهدف وكل خطواته؟')) return
    persist(goals.filter((g) => g.id !== goalId))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">أهدافك</h1>
        <p className="text-ink/50 mt-1 text-sm">حدد هدفًا كبيرًا، وأنا أكسّره لك لخطوات صغيرة قابلة للتنفيذ.</p>
      </div>

      <form onSubmit={addGoal} className="card p-5 space-y-3">
        <div>
          <label className="label">الهدف</label>
          <input
            className="input"
            placeholder="مثال: تحسين نومي، إنهاء مشروعي، بناء عادة الرياضة"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label">لماذا يهمك هذا الهدف؟ (اختياري)</label>
          <input className="input" value={why} onChange={(e) => setWhy(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary" disabled={!title.trim() || loading}>
          {loading ? 'جارٍ التخطيط…' : 'أضف الهدف'}
        </button>
        {fallbackNotice && (
          <p className="text-xs text-clay-500">
            لا يوجد مفتاح API مفعّل، فاقترحت خطوات عامة. لتفصيل أدق أضف مفتاحك من الإعدادات.
          </p>
        )}
      </form>

      <div className="space-y-4">
        {goals.map((goal) => {
          const doneCount = goal.steps.filter((s) => s.done).length
          return (
            <div key={goal.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h3 className="font-semibold text-sage-700">{goal.title}</h3>
                  {goal.why && <p className="text-xs text-ink/40 mt-0.5">{goal.why}</p>}
                </div>
                <button
                  type="button"
                  className="text-ink/30 hover:text-clay-500 text-sm"
                  onClick={() => deleteGoal(goal.id)}
                >
                  حذف
                </button>
              </div>

              <div className="h-1.5 rounded-full bg-sage-50 mt-3 mb-3 overflow-hidden">
                <div
                  className="h-full bg-sage-500 transition-all"
                  style={{ width: `${goal.steps.length ? (doneCount / goal.steps.length) * 100 : 0}%` }}
                />
              </div>

              <ul className="space-y-2">
                {goal.steps.map((step) => (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => toggleStep(goal.id, step.id)}
                      className={`w-full text-right flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${
                        step.done
                          ? 'border-sage-200 bg-sage-50 text-ink/40 line-through'
                          : 'border-black/10 hover:bg-black/5'
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${
                          step.done ? 'bg-sage-500 border-sage-500' : 'border-black/20'
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
        {goals.length === 0 && <div className="text-center text-ink/40 py-10">لا أهداف بعد. أضف أول هدف لك أعلاه.</div>}
      </div>
    </div>
  )
}
