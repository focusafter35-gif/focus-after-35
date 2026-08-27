import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/db.js'
import { storage as local } from '../lib/storage.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import ThemeSwitcher from '../components/ThemeSwitcher.jsx'

export default function SettingsPage() {
  const { t } = useLanguage()
  const { configured, user, signOut } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [travelMode, setTravelMode] = useState(false)
  const [profile, setProfile] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([db.getProfile(), db.getTravelMode()]).then(([p, tm]) => {
      if (cancelled) return
      setProfile(p)
      setTravelMode(tm)
      // The Anthropic key stays a per-browser setting until AI calls are
      // proxied through a server-side function — see supabase/README.md.
      setApiKey(local.getSettings().apiKey || '')
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  async function save() {
    local.setSettings({ ...local.getSettings(), apiKey })
    await Promise.all([db.setTravelMode(travelMode), profile ? db.setProfile(profile) : Promise.resolve()])
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  async function exportData() {
    const data = await db.exportAll()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rhythmai-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function clearData() {
    if (!confirm(t('settings.deleteConfirm'))) return
    await db.clearAll()
    if (configured) {
      navigate('/login')
    } else {
      window.location.hash = '#/welcome'
      window.location.reload()
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  if (loading) return <div className="text-center text-muted py-16">…</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold brand">{t('settings.title')}</h1>
        <p className="text-muted mt-1 text-sm">{t('settings.subtitle')}</p>
      </div>

      {configured && user && (
        <section className="card p-6 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">{t('auth.signedInAs', { email: user.email })}</p>
          <button type="button" className="btn-secondary whitespace-nowrap" onClick={handleSignOut}>
            {t('auth.signOut')}
          </button>
        </section>
      )}

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">{t('settings.languageSection')}</h2>
        <LanguageSwitcher />
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">{t('settings.themeSection')}</h2>
        <ThemeSwitcher />
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">{t('travel.toggleLabel')}</h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={travelMode}
            onChange={(e) => setTravelMode(e.target.checked)}
          />
          <span className="text-sm text-muted">{t('travel.toggleHelp')}</span>
        </label>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">{t('settings.aiSection')}</h2>
        <div>
          <label className="label">{t('settings.apiKeyLabel')}</label>
          <input
            type="password"
            className="input"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
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
