// Local calendar date as YYYY-MM-DD. Deliberately NOT toISOString() (which is
// UTC-based) — that would roll "today" to the wrong date in the evening for
// any user west of UTC.
export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Parses a YYYY-MM-DD key back into a local Date at midnight. Use this
// instead of `new Date(dateKey)`, which the spec parses as UTC and would
// shift the weekday by one day in negative UTC-offset timezones.
export function dateFromKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// 2023-01-01 was a Sunday — used as a fixed reference week so we can derive
// localized weekday names (Sun..Sat) for any supported language via Intl.
export function weekdayNames(lang) {
  const fmt = new Intl.DateTimeFormat(lang, { weekday: 'long', timeZone: 'UTC' })
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2023, 0, 1 + i))))
}

export function todayWeekdayName(lang, date = new Date()) {
  return new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(date)
}

export function weekdayNamesShort(lang) {
  const fmt = new Intl.DateTimeFormat(lang, { weekday: 'short', timeZone: 'UTC' })
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2023, 0, 1 + i))))
}
