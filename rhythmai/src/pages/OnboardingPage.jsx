import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage } from '../lib/storage.js'

const STEPS = [
  { key: 'name', label: 'اسمك', placeholder: 'كيف تحب أن أناديك؟', type: 'text' },
  { key: 'goals', label: 'أهدافك', placeholder: 'مثال: النوم أفضل، إنجاز مشروعي، تمرين 3 مرات أسبوعيًا', type: 'textarea' },
  { key: 'routine', label: 'روتينك اليومي الحالي', placeholder: 'صف يومك المعتاد باختصار', type: 'textarea' },
  { key: 'work', label: 'عملك أو دراستك', placeholder: 'طبيعة عملك وساعاته', type: 'textarea' },
  {
    key: 'healthNotes',
    label: 'ملاحظات صحية عامة (اختياري)',
    placeholder: 'أي شيء تريدني أن أراعيه — بدون تفاصيل طبية دقيقة',
    type: 'textarea',
    optional: true,
  },
  { key: 'tone', label: 'كيف تحب أن أذكّرك؟', type: 'choice', options: ['لطيفة وهادئة', 'مباشرة ومختصرة', 'محفزة وداعمة'] },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ tone: 'لطيفة وهادئة' })

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const canProceed = current.optional || (form[current.key] && form[current.key].trim().length > 0)

  function update(value) {
    setForm((f) => ({ ...f, [current.key]: value }))
  }

  function next() {
    if (isLast) {
      storage.setProfile({ ...form, createdAt: new Date().toISOString() })
      navigate('/')
      return
    }
    setStep((s) => s + 1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg card p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-block h-8 w-8 rounded-full bg-sage-600" />
          <h1 className="text-xl font-bold text-sage-700">RhythmAI</h1>
        </div>

        {step === 0 && (
          <p className="text-ink/60 mb-6 text-sm leading-relaxed">
            قبل أن نبدأ، أحتاج أن أتعرف عليك. كل ما تخبرني به يُحفظ على جهازك فقط، ولن أفعل شيئًا بدون موافقتك.
          </p>
        )}

        <div className="mb-2 text-xs text-ink/40">
          خطوة {step + 1} من {STEPS.length}
        </div>
        <label className="label">{current.label}</label>

        {current.type === 'text' && (
          <input
            autoFocus
            className="input"
            placeholder={current.placeholder}
            value={form[current.key] || ''}
            onChange={(e) => update(e.target.value)}
          />
        )}

        {current.type === 'textarea' && (
          <textarea
            autoFocus
            rows={4}
            className="input"
            placeholder={current.placeholder}
            value={form[current.key] || ''}
            onChange={(e) => update(e.target.value)}
          />
        )}

        {current.type === 'choice' && (
          <div className="flex flex-col gap-2">
            {current.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => update(opt)}
                className={`text-right rounded-xl border px-4 py-3 transition-colors ${
                  form[current.key] === opt
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-black/10 hover:bg-black/5'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            className="btn-ghost"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            رجوع
          </button>
          <button type="button" className="btn-primary" disabled={!canProceed} onClick={next}>
            {isLast ? 'ابدأ' : 'التالي'}
          </button>
        </div>
      </div>
    </div>
  )
}
