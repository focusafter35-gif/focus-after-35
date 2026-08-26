// The six official languages of the United Nations.
export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
  { code: 'ru', label: 'Русский', dir: 'ltr' },
]

export const DEFAULT_LANGUAGE = 'en'

export function dirFor(code) {
  return LANGUAGES.find((l) => l.code === code)?.dir || 'ltr'
}

// Full display name of each language, used when instructing the AI which
// language to answer in (kept in English for prompt reliability).
export const LANGUAGE_NAMES_EN = {
  en: 'English',
  ar: 'Arabic',
  fr: 'French',
  es: 'Spanish',
  zh: 'Simplified Chinese',
  ru: 'Russian',
}
