import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { storage } from '../lib/storage.js'
import { todayKey, todayWeekdayName } from '../lib/dates.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import EnergyCheckIn from '../components/EnergyCheckIn.jsx'
import EveningCheckIn from '../components/EveningCheckIn.jsx'

export default function DashboardPage() {
  const { t, lang } = useLanguage()
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

  const todayName = todayWeekdayName(lang)
  // plan.days is always ordered Sunday..Saturday (see ai.js normalizeDays/fallbackPlan),
  // so match by position — comparing localized day-name strings breaks once the UI
  // language changes after the plan was generated.
  const todayPlan = plan?.days?.[new Date().getDay()]

  const crisisEssentials = [t('dashboard.crisisItem1'), t('dashboard.crisisItem2'), t('dashboard.crisisItem3')]

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
    setDone((d) => (d.includes(task) ? d.filter((t2) => t2 !== task) : [...d, task]))
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
          <h1 className="text-2xl font-bold brand">
            {profile?.name ? t('dashboard.greeting', { name: profile.name }) : t('dashboard.greetingPlain')} 👋
          </h1>
          <p className="text-muted mt-1">{t('dashboard.todayIs', { day: todayName })}</p>
        </div>
        <button
          type="button"
          onClick={toggleCrisis}
          className={`btn whitespace-nowrap ${crisisActive ? 'btn-warn' : 'btn-secondary'}`}
        >
          {crisisActive ? t('dashboard.crisisEnd') : t('dashboard.crisisButton')}
        </button>
      </div>

      {crisisActive ? (
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold text-warn">{t('dashboard.crisisActiveTitle')}</h2>
          <p className="text-sm text-muted">{t('dashboard.crisisActiveBody')}</p>
          <ul className="space-y-2">
            {crisisEssentials.map((tItem) => (
              <li key={tItem} className="rounded-xl border border-border px-4 py-3 text-sm">
                {tItem}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {!energy && <EnergyCheckIn onSelect={selectEnergy} />}

          {energy && !plan && (
            <div className="card p-6 text-center space-y-3">
              <p className="text-muted">{t('dashboard.noPlan')}</p>
              <Link to="/plan" className="btn-primary inline-flex">
                {t('dashboard.createPlanNow')}
              </Link>
            </div>
          )}

          {energy && plan && !todayPlan && (
            <div className="card p-6 text-center text-muted">{t('dashboard.noTasksToday')}</div>
          )}

          {energy && todayPlan && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{t('dashboard.todaysTasks')}</h2>
                <button type="button" className="text-xs text-muted hover:underline" onClick={() => setEnergy(null)}>
                  {t('dashboard.changeEnergy')}
                </button>
              </div>
              {energy === 'low' && <p className="text-xs text-warn mb-3">{t('dashboard.lightDay')}</p>}
              <ul className="space-y-2">
                {visibleTasks.map((task) => (
                  <li key={task}>
                    <button
                      type="button"
                      onClick={() => toggle(task)}
                      className={`w-full text-start flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                        done.includes(task)
                          ? 'border-accent/30 bg-accentSoft text-muted line-through'
                          : 'border-border hover:bg-surfaceMuted'
                      }`}
                    >
                      <span
                        className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                          done.includes(task) ? 'bg-accent border-accent' : 'border-border'
                        }`}
                      />
                      {task}
                    </button>
                  </li>
                ))}
              </ul>

              {bonusSuggestion && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted mb-2">{t('dashboard.highEnergyBonus')}</p>
                  <button
                    type="button"
                    onClick={() => toggle(bonusSuggestion.text)}
                    className={`w-full text-start flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      done.includes(bonusSuggestion.text)
                        ? 'border-accent/30 bg-accentSoft text-muted line-through'
                        : 'border-accent/40 border-dashed hover:bg-accentSoft'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                        done.includes(bonusSuggestion.text) ? 'bg-accent border-accent' : 'border-border'
                      }`}
                    />
                    {bonusSuggestion.text}
                    <span className="text-xs text-muted ms-auto">({bonusSuggestion.goalTitle})</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Link to="/goals" className="btn-secondary flex-1 justify-center">
              {t('dashboard.linkGoals')}
            </Link>
            <Link to="/plan" className="btn-secondary flex-1 justify-center">
              {t('dashboard.linkPlan')}
            </Link>
            <Link to="/research" className="btn-secondary flex-1 justify-center">
              {t('dashboard.linkResearch')}
            </Link>
          </div>

          <EveningCheckIn savedAnswer={eveningEntry?.answer} onSave={saveEvening} recentEntries={recentEvenings} />
        </>
      )}
    </div>
  )
}
