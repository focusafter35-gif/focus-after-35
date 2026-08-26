import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations.js'
import { DEFAULT_LANGUAGE, dirFor } from './languages.js'
import { storage } from '../lib/storage.js'

const LanguageContext = createContext(null)

function interpolate(str, vars) {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, key) => (vars[key] ?? `{${key}}`))
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => storage.getSettings().language || DEFAULT_LANGUAGE)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dirFor(lang)
  }, [lang])

  function setLang(next) {
    setLangState(next)
    storage.setSettings({ ...storage.getSettings(), language: next })
  }

  const t = useMemo(() => {
    const dict = translations[lang] || translations[DEFAULT_LANGUAGE]
    const fallback = translations[DEFAULT_LANGUAGE]
    return (key, vars) => interpolate(dict[key] ?? fallback[key] ?? key, vars)
  }, [lang])

  const value = { lang, setLang, t, dir: dirFor(lang) }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
