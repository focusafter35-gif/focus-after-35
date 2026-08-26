import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage } from '../lib/storage.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

function useSteps(t) {
  return [
    { key: 'name', labelKey: 'onboarding.name.label', placeholderKey: 'onboarding.name.placeholder', type: 'text' },
    { key: 'goals', labelKey: 'onboarding.goals.label', placeholderKey: 'onboarding.goals.placeholder', type: 'textarea' },
    { key: 'routine', labelKey: 'onboarding.routine.label', placeholderKey: 'onboarding.routine.placeholder', type: 'textarea' },
    { key: 'work', labelKey: 'onboarding.work.label', placeholderKey: 'onboarding.work.placeholder', type: 'textarea' },
    {
      key: 'healthNotes',
      labelKey: 'onboarding.health.label',
      placeholderKey: 'onboarding.health.placeholder',
      type: 'textarea',
      optional: true,
    },
    {
      key: 'tone',
      labelKey: 'onboarding.tone.label',
      type: 'choice',
      options: [
        { value: t('onboarding.tone.gentle'), key: 'gentle' },
        { value: t('onboarding.tone.direct'), key: 'direct' },
        { value: t('onboarding.tone.motivating'), key: 'motivating' },
      ],
    },
  ]
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const STEPS = useSteps(t)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ tone: t('onboarding.tone.gentle') })

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher compact />
      </div>
      <div className="w-full max-w-lg card p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-block h-8 w-8 rounded-full bg-accent" />
          <h1 className="text-xl font-bold text-accent brand">RhythmAI</h1>
        </div>

        {step === 0 && <p className="text-muted mb-6 text-sm leading-relaxed">{t('onboarding.intro')}</p>}

        <div className="mb-2 text-xs text-muted">{t('onboarding.stepOf', { current: step + 1, total: STEPS.length })}</div>
        <label className="label">{t(current.labelKey)}</label>

        {current.type === 'text' && (
          <input
            autoFocus
            className="input"
            placeholder={t(current.placeholderKey)}
            value={form[current.key] || ''}
            onChange={(e) => update(e.target.value)}
          />
        )}

        {current.type === 'textarea' && (
          <textarea
            autoFocus
            rows={4}
            className="input"
            placeholder={t(current.placeholderKey)}
            value={form[current.key] || ''}
            onChange={(e) => update(e.target.value)}
          />
        )}

        {current.type === 'choice' && (
          <div className="flex flex-col gap-2">
            {current.options.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => update(opt.value)}
                className={`text-start rounded-xl border px-4 py-3 transition-colors ${
                  form[current.key] === opt.value
                    ? 'border-accent bg-accentSoft text-accent'
                    : 'border-border hover:bg-surfaceMuted'
                }`}
              >
                {opt.value}
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
            {t('onboarding.back')}
          </button>
          <button type="button" className="btn-primary" disabled={!canProceed} onClick={next}>
            {isLast ? t('onboarding.start') : t('onboarding.next')}
          </button>
        </div>
      </div>
    </div>
  )
}
