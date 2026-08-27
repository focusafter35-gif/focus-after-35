import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

export default function AuthPage() {
  const { t } = useLanguage()
  const { user, signUp, signIn } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signIn') // 'signIn' | 'signUp'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function submit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    const { error: err } = mode === 'signUp' ? await signUp(email, password) : await signIn(email, password)
    setLoading(false)
    if (err) {
      setError(err.message || t('auth.genericError'))
      return
    }
    if (mode === 'signUp') {
      setInfo(t('auth.checkEmail'))
      return
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher compact />
      </div>
      <div className="w-full max-w-sm card p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-block h-8 w-8 rounded-full bg-accent" />
          <h1 className="text-xl font-bold text-accent brand">RhythmAI</h1>
        </div>

        <h2 className="text-lg font-semibold mb-4">{mode === 'signUp' ? t('auth.signUpTitle') : t('auth.signInTitle')}</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">{t('auth.emailLabel')}</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('auth.passwordLabel')}</label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-warn">{error}</p>}
          {info && <p className="text-sm text-accent">{info}</p>}

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {mode === 'signUp' ? t('auth.signUpButton') : t('auth.signInButton')}
          </button>
        </form>

        <button
          type="button"
          className="text-sm text-muted hover:underline mt-4 w-full text-center"
          onClick={() => {
            setMode((m) => (m === 'signUp' ? 'signIn' : 'signUp'))
            setError('')
            setInfo('')
          }}
        >
          {mode === 'signUp' ? t('auth.switchToSignIn') : t('auth.switchToSignUp')}
        </button>
      </div>
    </div>
  )
}
