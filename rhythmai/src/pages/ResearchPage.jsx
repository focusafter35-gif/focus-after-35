import { useEffect, useState } from 'react'
import { db } from '../lib/db.js'
import { askResearch } from '../lib/ai.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'

export default function ResearchPage() {
  const { t, lang } = useLanguage()
  const [pageLoading, setPageLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    let cancelled = false
    Promise.all([db.getProfile(), db.getHistory()]).then(([p, h]) => {
      if (cancelled) return
      setProfile(p)
      setHistory(h)
      setPageLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  async function submit(e) {
    e.preventDefault()
    if (!question.trim() || loading) return
    setLoading(true)
    const q = question.trim()
    const result = await askResearch(q, profile, lang)
    const answer =
      result.source === 'ai'
        ? result.answer
        : result.flaggedMedical
          ? t('research.aiUnavailableNotice')
          : t('research.genericFallback')
    const entry = { question: q, answer, flaggedMedical: result.flaggedMedical, at: new Date().toISOString() }
    db.addHistoryEntry(entry).catch(() => {})
    setHistory((h) => [entry, ...h])
    setQuestion('')
    setLoading(false)
  }

  if (pageLoading) return <div className="text-center text-muted py-16">…</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold brand">{t('research.title')}</h1>
        <p className="text-muted mt-1 text-sm">{t('research.subtitle')}</p>
      </div>

      <DisclaimerBanner>{t('safety.medicalDisclaimer')}</DisclaimerBanner>

      <form onSubmit={submit} className="flex gap-2">
        <input
          className="input"
          placeholder={t('research.placeholder')}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
          {loading ? t('research.searching') : t('research.search')}
        </button>
      </form>

      <div className="space-y-4">
        {history.map((h, i) => (
          <div key={i} className="card p-5">
            <p className="font-medium text-accent mb-2">{h.question}</p>
            <p className="text-ink/80 text-sm whitespace-pre-wrap leading-relaxed">{h.answer}</p>
            {h.flaggedMedical && <p className="text-xs text-warn mt-3">{t('safety.medicalDisclaimer')}</p>}
          </div>
        ))}
        {history.length === 0 && <div className="text-center text-muted py-10">{t('research.empty')}</div>}
      </div>
    </div>
  )
}
