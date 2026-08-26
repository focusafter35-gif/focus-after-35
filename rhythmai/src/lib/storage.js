// Everything RhythmAI knows about you lives only in this browser's localStorage.
// Nothing here is ever sent anywhere except directly from your browser to the
// AI provider you configure in Settings (and only when you ask it to plan or research).

const KEYS = {
  profile: 'rhythmai.profile',
  plan: 'rhythmai.plan',
  tasks: 'rhythmai.tasks',
  settings: 'rhythmai.settings',
  history: 'rhythmai.research_history',
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

  getTasks: () => read(KEYS.tasks, []),
  setTasks: (tasks) => write(KEYS.tasks, tasks),

  getSettings: () => read(KEYS.settings, { apiKey: '', tone: 'gentle', notifications: false }),
  setSettings: (settings) => write(KEYS.settings, settings),

  getHistory: () => read(KEYS.history, []),
  addHistoryEntry: (entry) => {
    const history = read(KEYS.history, [])
    history.unshift(entry)
    write(KEYS.history, history.slice(0, 50))
  },

  clearAll: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  },

  exportAll: () => ({
    profile: read(KEYS.profile, null),
    plan: read(KEYS.plan, null),
    tasks: read(KEYS.tasks, []),
    settings: { ...read(KEYS.settings, {}), apiKey: undefined },
    history: read(KEYS.history, []),
    exportedAt: new Date().toISOString(),
  }),
}
