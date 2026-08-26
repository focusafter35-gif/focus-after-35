import { useState } from 'react'
import { storage } from '../lib/storage.js'

export default function SettingsPage() {
  const [settings, setSettings] = useState(() => storage.getSettings())
  const [profile, setProfile] = useState(() => storage.getProfile())
  const [saved, setSaved] = useState(false)

  function save() {
    storage.setSettings(settings)
    if (profile) storage.setProfile(profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function exportData() {
    const data = storage.exportAll()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rhythmai-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function clearData() {
    if (!confirm('سيتم حذف كل بياناتك (ملفك الشخصي، خطتك، سجل بحثك) من هذا المتصفح نهائيًا. متأكد؟')) return
    storage.clearAll()
    window.location.href = '/welcome'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-ink/50 mt-1 text-sm">كل شيء هنا يُحفظ في متصفحك فقط.</p>
      </div>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">الذكاء الاصطناعي</h2>
        <div>
          <label className="label">مفتاح Anthropic API</label>
          <input
            type="password"
            className="input"
            placeholder="sk-ant-..."
            value={settings.apiKey || ''}
            onChange={(e) => setSettings((s) => ({ ...s, apiKey: e.target.value }))}
          />
          <p className="text-xs text-ink/40 mt-1.5">
            يُرسل هذا المفتاح من متصفحك مباشرة إلى Anthropic فقط عند طلب خطة أو بحث. لا يمر عبر أي خادم تابع لنا لأنه لا يوجد خادم أصلاً.
            بدون مفتاح، سيستخدم RhythmAI اقتراحات عامة مبسطة.
          </p>
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">ملفك الشخصي</h2>
        {profile && (
          <>
            <div>
              <label className="label">الاسم</label>
              <input
                className="input"
                value={profile.name || ''}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">الأهداف</label>
              <textarea
                rows={3}
                className="input"
                value={profile.goals || ''}
                onChange={(e) => setProfile((p) => ({ ...p, goals: e.target.value }))}
              />
            </div>
          </>
        )}
      </section>

      <button type="button" className="btn-primary" onClick={save}>
        {saved ? 'تم الحفظ ✓' : 'حفظ'}
      </button>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">بياناتك وخصوصيتك</h2>
        <p className="text-sm text-ink/50">
          RhythmAI لا يملك خادمًا يخزّن بياناتك. كل شيء — ملفك، خطتك، سجل بحثك — موجود فقط في هذا المتصفح على هذا الجهاز.
        </p>
        <div className="flex gap-3">
          <button type="button" className="btn-secondary" onClick={exportData}>
            تصدير بياناتي
          </button>
          <button type="button" className="btn-ghost text-clay-500" onClick={clearData}>
            حذف كل بياناتي
          </button>
        </div>
      </section>
    </div>
  )
}
