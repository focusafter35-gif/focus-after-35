import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { storage } from '../lib/storage.js'
import { todayKey } from '../lib/dates.js'
import EnergyCheckIn from '../components/EnergyCheckIn.jsx'
import EveningCheckIn from '../components/EveningCheckIn.jsx'

const WEEKDAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

const CRISIS_ESSENTIALS = [
  'اشرب كوب ماء',
  'تنفس بعمق لمدة دقيقتين',
  'لا داعي لإنجاز أي شيء آخر اليوم — يكفي أنك اعتنيت بنفسك',
]

export default function DashboardPage() {
  const key = todayKey()
  const [profile] = useState(() => storage.getProfile())
  const [plan] = useState(() => storage.getPlan())
  const [goals] = useState(() => storage.getGoals())
  const [done, setDone] = useState(() => storage.getTasks())
  const [energy, setEnergy] = useState(() => storage.getEnergyLog()[key] || null)
  const [crisisActive, setCrisisActive] = useState(() => !!storage.getCrisisLog()[key])
  const [eveningEntry, setEveningEntry] = useState(() => storage.getEveningLog().find((e) => e.date === key))

  useEffect(() => {
    storage.setTasks(done)
  }, [done])

  const todayName = WEEKDAYS_AR[new Date().getDay()]
  const todayPlan = plan?.days?.find((d) => d.day === todayName)

  const visibleTasks = useMemo(() => {
    if (!todayPlan) return []
    if (energy === 'low') return todayPlan.tasks.slice(0, 1)
    return todayPlan.tasks
  }, [todayPlan, energy])

  const bonusSuggestion = useMemo(() => {
    if (energy !== 'high') return null
    for (const g of goals) {
      const next = g.steps.find((s) => !s.done)
      if (next) return { goalTitle: g.title, text: next.text }
    }
    return null
  }, [energy, goals])

  function toggle(task) {
    setDone((d) => (d.includes(task) ? d.filter((t) => t !== task) : [...d, task]))
  }

  function selectEnergy(level) {
    storage.setTodayEnergy(key, level)
    setEnergy(level)
  }

  function toggleCrisis() {
    const next = !crisisActive
    storage.setCrisisToday(key, next)
    setCrisisActive(next)
  }

  function saveEvening(answer) {
    storage.setTodayEveningEntry(key, answer)
    setEveningEntry({ date: key, answer, at: new Date().toISOString() })
  }

  const recentEvenings = storage.getEveningLog().filter((e) => e.date !== key).slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            أهلاً {profile?.name ? `يا ${profile.name}` : ''} 👋
          </h1>
          <p className="text-ink/50 mt-1">اليوم {todayName}.</p>
        </div>
        <button
          type="button"
          onClick={toggleCrisis}
          className={`btn whitespace-nowrap ${
            crisisActive ? 'bg-clay-500 text-white hover:bg-clay-500/90' : 'btn-secondary'
          }`}
        >
          {crisisActive ? 'إنهاء وضع الأزمة' : '🆘 يوم صعب'}
        </button>
      </div>

      {crisisActive ? (
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold text-clay-500">وضع الأزمة مُفعّل</h2>
          <p className="text-sm text-ink/50">ألغيت كل شيء غير ضروري. ركّز فقط على هذا:</p>
          <ul className="space-y-2">
            {CRISIS_ESSENTIALS.map((t) => (
              <li key={t} className="rounded-xl border border-black/10 px-4 py-3 text-sm">
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {!energy && <EnergyCheckIn onSelect={selectEnergy} />}

          {energy && !plan && (
            <div className="card p-6 text-center space-y-3">
              <p className="text-ink/60">لم تنشئ خطتك الأسبوعية بعد.</p>
              <Link to="/plan" className="btn-primary inline-flex">
                أنشئ خطتك الآن
              </Link>
            </div>
          )}

          {energy && plan && !todayPlan && (
            <div className="card p-6 text-center text-ink/60">لا توجد مهام محددة لهذا اليوم في خطتك.</div>
          )}

          {energy && todayPlan && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">مهام اليوم</h2>
                <button type="button" className="text-xs text-ink/40 hover:underline" onClick={() => setEnergy(null)}>
                  غيّر مستوى طاقتك
                </button>
              </div>
              {energy === 'low' && (
                <p className="text-xs text-clay-500 mb-3">يوم خفيف اليوم — ركّز فقط على الأهم.</p>
              )}
              <ul className="space-y-2">
                {visibleTasks.map((task) => (
                  <li key={task}>
                    <button
                      type="button"
                      onClick={() => toggle(task)}
                      className={`w-full text-right flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                        done.includes(task)
                          ? 'border-sage-200 bg-sage-50 text-ink/40 line-through'
                          : 'border-black/10 hover:bg-black/5'
                      }`}
                    >
                      <span
                        className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                          done.includes(task) ? 'bg-sage-500 border-sage-500' : 'border-black/20'
                        }`}
                      />
                      {task}
                    </button>
                  </li>
                ))}
              </ul>

              {bonusSuggestion && (
                <div className="mt-4 pt-4 border-t border-black/5">
                  <p className="text-xs text-ink/40 mb-2">طاقتك عالية اليوم — فرصة جيدة لخطوة إضافية:</p>
                  <button
                    type="button"
                    onClick={() => toggle(bonusSuggestion.text)}
                    className={`w-full text-right flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      done.includes(bonusSuggestion.text)
                        ? 'border-sage-200 bg-sage-50 text-ink/40 line-through'
                        : 'border-sage-300 border-dashed hover:bg-sage-50'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                        done.includes(bonusSuggestion.text) ? 'bg-sage-500 border-sage-500' : 'border-black/20'
                      }`}
                    />
                    {bonusSuggestion.text}
                    <span className="text-xs text-ink/30 mr-auto">({bonusSuggestion.goalTitle})</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Link to="/goals" className="btn-secondary flex-1 justify-center">
              أهدافك
            </Link>
            <Link to="/plan" className="btn-secondary flex-1 justify-center">
              الخطة الأسبوعية
            </Link>
            <Link to="/research" className="btn-secondary flex-1 justify-center">
              اسألني شيئًا
            </Link>
          </div>

          <EveningCheckIn savedAnswer={eveningEntry?.answer} onSave={saveEvening} recentEntries={recentEvenings} />
        </>
      )}
    </div>
  )
}
