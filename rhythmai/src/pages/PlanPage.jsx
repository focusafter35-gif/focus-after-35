import { useState } from 'react'
import { storage } from '../lib/storage.js'
import { generateWeeklyPlan } from '../lib/ai.js'

export default function PlanPage() {
  const [profile] = useState(() => storage.getProfile())
  const [draft, setDraft] = useState(() => storage.getPlan())
  const [loading, setLoading] = useState(false)
  const [fallbackNotice, setFallbackNotice] = useState(false)

  async function regenerate() {
    setLoading(true)
    setFallbackNotice(false)
    const result = await generateWeeklyPlan(profile)
    setDraft({ days: result.days })
    setFallbackNotice(result.source === 'fallback')
    setLoading(false)
  }

  function updateTask(dayIdx, taskIdx, value) {
    setDraft((d) => {
      const days = d.days.map((day, i) =>
        i !== dayIdx ? day : { ...day, tasks: day.tasks.map((t, j) => (j === taskIdx ? value : t)) }
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
    const cleaned = { days: draft.days.map((d) => ({ ...d, tasks: d.tasks.filter((t) => t.trim()) })) }
    storage.setPlan(cleaned)
    setDraft(cleaned)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">خطتك الأسبوعية</h1>
          <p className="text-ink/50 mt-1 text-sm">أقترح، وأنت توافق أو تعدّل. لا شيء يُحفظ بدون ضغطك على "اعتماد الخطة".</p>
        </div>
        <button type="button" className="btn-secondary whitespace-nowrap" onClick={regenerate} disabled={loading}>
          {loading ? 'جارٍ التفكير…' : draft ? 'اقترح من جديد' : 'اقترح خطة'}
        </button>
      </div>

      {fallbackNotice && (
        <div className="rounded-xl border border-clay-400/40 bg-clay-400/10 px-4 py-3 text-sm text-clay-500">
          لا يوجد مفتاح API مفعّل، فاقترحت خطة عامة بسيطة. لخطة مخصصة بالذكاء الاصطناعي أضف مفتاحك من الإعدادات.
        </div>
      )}

      {!draft && !loading && (
        <div className="card p-10 text-center text-ink/50">اضغط "اقترح خطة" لأبدأ باقتراح أسبوعك.</div>
      )}

      {draft && (
        <div className="space-y-4">
          {draft.days.map((day, dayIdx) => (
            <div key={day.day} className="card p-5">
              <h3 className="font-semibold text-sage-700 mb-3">{day.day}</h3>
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
                      className="text-ink/30 hover:text-clay-500 px-2"
                      onClick={() => removeTask(dayIdx, taskIdx)}
                      aria-label="حذف"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="text-sage-600 text-sm mt-2 hover:underline" onClick={() => addTask(dayIdx)}>
                + إضافة مهمة
              </button>
            </div>
          ))}

          <button type="button" className="btn-primary w-full justify-center" onClick={approve}>
            اعتماد الخطة
          </button>
        </div>
      )}
    </div>
  )
}
