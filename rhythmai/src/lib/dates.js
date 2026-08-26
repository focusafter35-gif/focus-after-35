export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
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
