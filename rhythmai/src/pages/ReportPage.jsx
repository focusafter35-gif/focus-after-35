import { useEffect, useState } from 'react'
import { storage } from '../lib/storage.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { weekdayNamesShort } from '../lib/dates.js'
import { computeWeekSummary, detectPatterns, mostCommonEnergy } from '../lib/insights.js'
import { generateWeeklyReport } from '../lib/ai.js'

const ENERGY_EMOJI = { low: '🌧️', medium: '⛅', high: '☀️' }

export default function ReportPage() {
  const { t, lang } = useLanguage()
  const [profile] = useState(() => storage.getProfile())
  const [plan] = useState(() => storage.getPlan())
  const [goals] = useState(() => storage.getGoals())

  const summary = computeWeekSummary(
    {
      plan,
      completionLog: storage.getCompletionLog(),
      energyLog: storage.getEnergyLog(),
      eveningLog: storage.getEveningLog(),
    },
    lang
  )
  const patterns = detectPatterns(
    {
      energyLog: storage.getEnergyLog(),
      completionLog: storage.getCompletionLog(),
      eveningLog: storage.getEveningLog(),
      goals,
    },
    lang,
    t
  )

  const shortLabels = weekdayNamesShort(lang)
  const ratePct = summary.completionRate != null ? Math.round(summary.completionRate * 100) : null
  const topEnergy = mostCommonEnergy(summary.energyCounts)

  const [narrative, setNarrative] = useState(null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (!plan) return
    setLoading(true)
    const result = await generateWeeklyReport(summary, profile, lang)
    setNarrative(result)
    setLoading(false)
  }

  useEffect(() => {
    if (plan) generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fallbackText = t('report.fallbackSummary', {
    rate: ratePct ?? 0,
    energy: topEnergy ? t(`energy.${topEnergy}`) : '—',
    eveningCount: summary.eveningCount,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold brand">{t('report.title')}</h1>
        <p className="text-muted mt-1 text-sm">{t('report.subtitle')}</p>
      </div>

      {!plan ? (
        <div className="card p-10 text-center text-muted">{t('report.noPlanYet')}</div>
      ) : (
        <>
          <div className="card p-6">
            <h2 className="font-semibold mb-4">{t('report.completionRate')}</h2>
            <div className="flex items-end gap-2 h-28">
              {summary.days.map((d, i) => (
                <div key={d.dateKey} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-20 flex items-end bg-surfaceMuted rounded-lg overflow-hidden">
                    {!d.isFuture && d.rate != null && (
                      <div
                        className="w-full bg-accent rounded-t-lg transition-all"
                        style={{ height: `${Math.max(6, d.rate * 100)}%` }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-muted">{shortLabels[i]}</span>
                </div>
              ))}
            </div>
            {ratePct != null && (
              <p className="text-sm text-muted mt-4">
                {summary.totalCompleted}/{summary.totalPlanned} · {ratePct}%
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-6">
              <h2 className="font-semibold mb-3">{t('report.energyDistribution')}</h2>
              <div className="flex gap-4">
                {['low', 'medium', 'high'].map((lvl) => (
                  <div key={lvl} className="flex-1 text-center">
                    <div className="text-2xl">{ENERGY_EMOJI[lvl]}</div>
                    <div className="text-lg font-semibold mt-1">{summary.energyCounts[lvl]}</div>
                    <div className="text-xs text-muted">{t(`energy.${lvl}`)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold mb-3">{t('report.eveningReflections')}</h2>
              <div className="text-3xl font-semibold text-accent">{summary.eveningCount}/7</div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold mb-3">{t('report.narrativeTitle')}</h2>
            {loading ? (
              <p className="text-sm text-muted">{t('report.generating')}</p>
            ) : (
              <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">
                {narrative?.source === 'ai' ? narrative.text : fallbackText}
              </p>
            )}
            <button type="button" className="btn-secondary mt-4" onClick={generate} disabled={loading}>
              {t('report.refresh')}
            </button>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold mb-3">{t('report.patternsTitle')}</h2>
            {patterns.length === 0 ? (
              <p className="text-sm text-muted">{t('insights.notEnoughData')}</p>
            ) : (
              <ul className="space-y-2">
                {patterns.map((p, i) => (
                  <li key={i} className="rounded-xl border border-border px-4 py-3 text-sm flex gap-2">
                    <span aria-hidden>📊</span>
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
