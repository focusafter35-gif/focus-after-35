import { todayKey, dateFromKey } from './dates.js'

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 }

export function daysUntil(deadline) {
  if (!deadline) return null
  const today = dateFromKey(todayKey())
  const due = dateFromKey(deadline)
  return Math.round((due - today) / (1000 * 60 * 60 * 24))
}

export function urgencyStatus(deadline) {
  const d = daysUntil(deadline)
  if (d === null) return 'none'
  if (d < 0) return 'overdue'
  if (d <= 3) return 'soon'
  return 'normal'
}

export function sortProjects(projects) {
  return [...projects].sort((a, b) => {
    const da = daysUntil(a.deadline)
    const db = daysUntil(b.deadline)
    if (da !== null && db !== null && da !== db) return da - db
    if (da !== null && db === null) return -1
    if (da === null && db !== null) return 1
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  })
}

// The single most urgent unfinished task across all projects, if any.
export function mostUrgentTask(projects) {
  for (const project of sortProjects(projects)) {
    const next = project.tasks.find((tk) => !tk.done)
    if (next) return { projectId: project.id, projectTitle: project.title, task: next }
  }
  return null
}
