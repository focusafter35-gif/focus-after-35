import { useState } from 'react'
import { storage } from '../lib/storage.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import ThemeSwitcher from '../components/ThemeSwitcher.jsx'

export default function SettingsPage() {
  const { t } = useLanguage()
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
    if (!confirm(t('settings.deleteConfirm'))) return
    storage.clearAll()
    window.location.href = '/welcome'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold brand">{t('settings.title')}</h1>
        <p className="text-muted mt-1 text-sm">{t('settings.subtitle')}</p>
      </div>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">{t('settings.languageSection')}</h2>
        <LanguageSwitcher />
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">{t('settings.themeSection')}</h2>
        <ThemeSwitcher />
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">{t('settings.aiSection')}</h2>
        <div>
          <label className="label">{t('settings.apiKeyLabel')}</label>
          <input
            type="password"
            className="input"
            placeholder="sk-ant-..."
            value={settings.apiKey || ''}
            onChange={(e) => setSettings((s) => ({ ...s, apiKey: e.target.value }))}
          />
          <p className="text-xs text-muted mt-1.5">{t('settings.apiKeyHelp')}</p>
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">{t('settings.profileSection')}</h2>
        {profile && (
          <>
            <div>
              <label className="label">{t('settings.nameLabel')}</label>
              <input
                className="input"
                value={profile.name || ''}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">{t('settings.goalsLabel')}</label>
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
        {saved ? t('settings.saved') : t('settings.save')}
      </button>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">{t('settings.dataSection')}</h2>
        <p className="text-sm text-muted">{t('settings.dataBody')}</p>
        <div className="flex gap-3">
          <button type="button" className="btn-secondary" onClick={exportData}>
            {t('settings.export')}
          </button>
          <button type="button" className="btn-ghost text-warn" onClick={clearData}>
            {t('settings.deleteAll')}
          </button>
        </div>
      </section>
    </div>
  )
}
