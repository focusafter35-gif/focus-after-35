import { useState } from 'react'

export default function EveningCheckIn({ savedAnswer, onSave, recentEntries }) {
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
      <h2 className="font-semibold mb-1">🌙 سؤال الليلة</h2>
      <p className="text-xs text-ink/40 mb-3">ما هو أفضل شيء حدث معك اليوم، مهما كان بسيطًا؟</p>

      {editing ? (
        <form onSubmit={submit} className="flex gap-2">
          <input className="input" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
          <button type="submit" className="btn-primary whitespace-nowrap" disabled={!value.trim()}>
            حفظ
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-full text-right rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-ink/70"
        >
          {savedAnswer} <span className="text-sage-600">(عدّل)</span>
        </button>
      )}

      {recentEntries?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <p className="text-xs text-ink/40 mb-2">ذكرياتك الأخيرة</p>
          <ul className="space-y-1.5">
            {recentEntries.map((e) => (
              <li key={e.date} className="text-xs text-ink/50 flex gap-2">
                <span className="text-ink/30">{e.date}</span>
                <span>{e.answer}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
