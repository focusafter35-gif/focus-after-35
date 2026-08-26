// Everything RhythmAI knows about you lives only in this browser's localStorage.
// Nothing here is ever sent anywhere except directly from your browser to the
// AI provider you configure in Settings (and only when you ask it to plan or research).

const KEYS = {
  profile: 'rhythmai.profile',
  plan: 'rhythmai.plan',
  settings: 'rhythmai.settings',
  history: 'rhythmai.research_history',
  goals: 'rhythmai.goals',
  projects: 'rhythmai.projects',
  energyLog: 'rhythmai.energy_log',
  crisisLog: 'rhythmai.crisis_log',
  eveningLog: 'rhythmai.evening_log',
  completionLog: 'rhythmai.completion_log',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — fail silently, app still works in-memory for the session
  }
}

export const storage = {
  getProfile: () => read(KEYS.profile, null),
  setProfile: (profile) => write(KEYS.profile, profile),
  hasProfile: () => !!read(KEYS.profile, null),

  getPlan: () => read(KEYS.plan, null),
  setPlan: (plan) => write(KEYS.plan, plan),

  // ---- Task completion, scoped per day: { [dateKey]: string[] } ----
  getCompletionLog: () => read(KEYS.completionLog, {}),
  getCompletedToday: (dateKey) => read(KEYS.completionLog, {})[dateKey] || [],
  setCompletedToday: (dateKey, completed) => {
    const log = read(KEYS.completionLog, {})
    log[dateKey] = completed
    write(KEYS.completionLog, log)
  },

  getSettings: () =>
    read(KEYS.settings, {
      apiKey: '',
      tone: 'gentle',
      notifications: false,
      language: 'en',
      theme: 'platinum-pearl',
      travelMode: false,
    }),
  setSettings: (settings) => write(KEYS.settings, settings),

  getHistory: () => read(KEYS.history, []),
  addHistoryEntry: (entry) => {
    const history = read(KEYS.history, [])
    history.unshift(entry)
    write(KEYS.history, history.slice(0, 50))
  },

  // ---- Goals (each: { id, title, why, steps: [{ id, text, done }], createdAt }) ----
  getGoals: () => read(KEYS.goals, []),
  setGoals: (goals) => write(KEYS.goals, goals),

  // ---- Projects (each: { id, title, deadline, priority, tasks: [{ id, text, done }], createdAt }) ----
  getProjects: () => read(KEYS.projects, []),
  setProjects: (projects) => write(KEYS.projects, projects),

  // ---- Morning energy check-in: { [dateKey]: 'low' | 'medium' | 'high' } ----
  getEnergyLog: () => read(KEYS.energyLog, {}),
  setTodayEnergy: (dateKey, level) => {
    const log = read(KEYS.energyLog, {})
    log[dateKey] = level
    write(KEYS.energyLog, log)
  },

  // ---- Crisis ("hard day") mode: { [dateKey]: true } ----
  getCrisisLog: () => read(KEYS.crisisLog, {}),
  setCrisisToday: (dateKey, active) => {
    const log = read(KEYS.crisisLog, {})
    if (active) log[dateKey] = true
    else delete log[dateKey]
    write(KEYS.crisisLog, log)
  },

  // ---- Evening check-in: [{ date, answer, at }] ----
  getEveningLog: () => read(KEYS.eveningLog, []),
  setTodayEveningEntry: (dateKey, answer) => {
    const log = read(KEYS.eveningLog, []).filter((e) => e.date !== dateKey)
    log.unshift({ date: dateKey, answer, at: new Date().toISOString() })
    write(KEYS.eveningLog, log.slice(0, 90))
  },

  clearAll: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  },

  exportAll: () => ({
    profile: read(KEYS.profile, null),
    plan: read(KEYS.plan, null),
    completionLog: read(KEYS.completionLog, {}),
    settings: { ...read(KEYS.settings, {}), apiKey: undefined },
    history: read(KEYS.history, []),
    goals: read(KEYS.goals, []),
    projects: read(KEYS.projects, []),
    energyLog: read(KEYS.energyLog, {}),
    crisisLog: read(KEYS.crisisLog, {}),
    eveningLog: read(KEYS.eveningLog, []),
    exportedAt: new Date().toISOString(),
  }),
}
