import { useState } from 'react'
import { storage } from '../lib/storage.js'
import { askResearch } from '../lib/ai.js'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import { MEDICAL_DISCLAIMER_AR } from '../lib/safety.js'

export default function ResearchPage() {
  const [profile] = useState(() => storage.getProfile())
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState(() => storage.getHistory())

  async function submit(e) {
    e.preventDefault()
    if (!question.trim() || loading) return
    setLoading(true)
    const q = question.trim()
    const result = await askResearch(q, profile)
    const entry = { question: q, answer: result.answer, flaggedMedical: result.flaggedMedical, at: new Date().toISOString() }
    storage.addHistoryEntry(entry)
    setHistory((h) => [entry, ...h])
    setQuestion('')
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">اسألني شيئًا</h1>
        <p className="text-ink/50 mt-1 text-sm">
          عن التغذية، النوم، الإنتاجية، أو العمل — سأبحث وألخص لك بشكل مفهوم.
        </p>
      </div>

      <DisclaimerBanner>{MEDICAL_DISCLAIMER_AR}</DisclaimerBanner>

      <form onSubmit={submit} className="flex gap-2">
        <input
          className="input"
          placeholder="مثال: كيف أحسّن نومي هذا الأسبوع؟"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
          {loading ? 'جارٍ البحث…' : 'ابحث'}
        </button>
      </form>

      <div className="space-y-4">
        {history.map((h, i) => (
          <div key={i} className="card p-5">
            <p className="font-medium text-sage-700 mb-2">{h.question}</p>
            <p className="text-ink/70 text-sm whitespace-pre-wrap leading-relaxed">{h.answer}</p>
            {h.flaggedMedical && (
              <p className="text-xs text-clay-500 mt-3">{MEDICAL_DISCLAIMER_AR}</p>
            )}
          </div>
        ))}
        {history.length === 0 && <div className="text-center text-ink/40 py-10">لا أسئلة بعد.</div>}
      </div>
    </div>
  )
}
