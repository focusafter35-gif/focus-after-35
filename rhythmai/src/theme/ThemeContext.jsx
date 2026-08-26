import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_THEME } from './themes.js'
import { storage } from '../lib/storage.js'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => storage.getSettings().theme || DEFAULT_THEME)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function setTheme(next) {
    setThemeState(next)
    storage.setSettings({ ...storage.getSettings(), theme: next })
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
