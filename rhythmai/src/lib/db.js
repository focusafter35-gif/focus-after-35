// The single data-access surface every page uses. When Supabase isn't
// configured (no VITE_SUPABASE_URL/ANON_KEY), everything transparently falls
// back to the original local-only storage.js — so the app keeps working
// exactly as before with zero setup. When Supabase IS configured, every call
// goes to Postgres, scoped by row-level security to the signed-in user.
//
// Language and theme intentionally stay device-local (see LanguageContext /
// ThemeContext) — those are per-browser UI preferences, not account data.

import { supabase, supabaseConfigured } from './supabaseClient.js'
import { storage as local } from './storage.js'

async function currentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

// ---- Profile ----

async function getProfile() {
  if (!supabaseConfigured) return local.getProfile()
  const uid = await currentUserId()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    name: data.name,
    goals: data.goals,
    routine: data.routine,
    work: data.work,
    healthNotes: data.health_notes,
    tone: data.tone,
    createdAt: data.created_at,
  }
}

async function hasProfile() {
  const p = await getProfile()
  return !!p?.name
}

async function setProfile(profile) {
  if (!supabaseConfigured) return local.setProfile(profile)
  const uid = await currentUserId()
  const { error } = await supabase.from('profiles').upsert({
    id: uid,
    name: profile.name,
    goals: profile.goals,
    routine: profile.routine,
    work: profile.work,
    health_notes: profile.healthNotes,
    tone: profile.tone,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

// ---- Weekly plan ----

async function getPlan() {
  if (!supabaseConfigured) return local.getPlan()
  const uid = await currentUserId()
  const { data, error } = await supabase.from('weekly_plans').select('days').eq('user_id', uid).maybeSingle()
  if (error) throw error
  return data ? { days: data.days } : null
}

async function setPlan(plan) {
  if (!supabaseConfigured) return local.setPlan(plan)
  const uid = await currentUserId()
  const { error } = await supabase
    .from('weekly_plans')
    .upsert({ user_id: uid, days: plan.days, updated_at: new Date().toISOString() })
  if (error) throw error
}

// ---- Task completion (per day) ----

async function getCompletionLog() {
  if (!supabaseConfigured) return local.getCompletionLog()
  const uid = await currentUserId()
  const { data, error } = await supabase.from('completion_log').select('date, completed').eq('user_id', uid)
  if (error) throw error
  return Object.fromEntries(data.map((row) => [row.date, row.completed]))
}

async function getCompletedToday(dateKey) {
  if (!supabaseConfigured) return local.getCompletedToday(dateKey)
  const uid = await currentUserId()
  const { data, error } = await supabase
    .from('completion_log')
    .select('completed')
    .eq('user_id', uid)
    .eq('date', dateKey)
    .maybeSingle()
  if (error) throw error
  return data?.completed || []
}

async function setCompletedToday(dateKey, completed) {
  if (!supabaseConfigured) return local.setCompletedToday(dateKey, completed)
  const uid = await currentUserId()
  const { error } = await supabase
    .from('completion_log')
    .upsert({ user_id: uid, date: dateKey, completed })
  if (error) throw error
}

// ---- Goals (whole-array replace, mirroring the local storage contract) ----

async function getGoals() {
  if (!supabaseConfigured) return local.getGoals()
  const uid = await currentUserId()
  const { data, error } = await supabase
    .from('goals')
    .select('id, title, why, steps, created_at')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map((g) => ({ id: g.id, title: g.title, why: g.why, steps: g.steps, createdAt: g.created_at }))
}

async function setGoals(goals) {
  if (!supabaseConfigured) return local.setGoals(goals)
  const uid = await currentUserId()
  // Simplest correct approach: replace the whole set. Fine at this data
  // scale (a handful of goals per user); a heavier product would diff
  // instead of delete-and-reinsert.
  const { error: delError } = await supabase.from('goals').delete().eq('user_id', uid)
  if (delError) throw delError
  if (goals.length === 0) return
  const rows = goals.map((g) => ({
    id: g.id,
    user_id: uid,
    title: g.title,
    why: g.why,
    steps: g.steps,
    created_at: g.createdAt,
  }))
  const { error } = await supabase.from('goals').insert(rows)
  if (error) throw error
}

// ---- Projects (same whole-array replace pattern as goals) ----

async function getProjects() {
  if (!supabaseConfigured) return local.getProjects()
  const uid = await currentUserId()
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, deadline, priority, tasks, created_at')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map((p) => ({
    id: p.id,
    title: p.title,
    deadline: p.deadline,
    priority: p.priority,
    tasks: p.tasks,
    createdAt: p.created_at,
  }))
}

async function setProjects(projects) {
  if (!supabaseConfigured) return local.setProjects(projects)
  const uid = await currentUserId()
  const { error: delError } = await supabase.from('projects').delete().eq('user_id', uid)
  if (delError) throw delError
  if (projects.length === 0) return
  const rows = projects.map((p) => ({
    id: p.id,
    user_id: uid,
    title: p.title,
    deadline: p.deadline,
    priority: p.priority,
    tasks: p.tasks,
    created_at: p.createdAt,
  }))
  const { error } = await supabase.from('projects').insert(rows)
  if (error) throw error
}

// ---- Morning energy check-in ----

async function getEnergyLog() {
  if (!supabaseConfigured) return local.getEnergyLog()
  const uid = await currentUserId()
  const { data, error } = await supabase.from('energy_log').select('date, level').eq('user_id', uid)
  if (error) throw error
  return Object.fromEntries(data.map((row) => [row.date, row.level]))
}

async function setTodayEnergy(dateKey, level) {
  if (!supabaseConfigured) return local.setTodayEnergy(dateKey, level)
  const uid = await currentUserId()
  const { error } = await supabase.from('energy_log').upsert({ user_id: uid, date: dateKey, level })
  if (error) throw error
}

// ---- Crisis mode ----

async function getCrisisLog() {
  if (!supabaseConfigured) return local.getCrisisLog()
  const uid = await currentUserId()
  const { data, error } = await supabase.from('crisis_log').select('date').eq('user_id', uid)
  if (error) throw error
  return Object.fromEntries(data.map((row) => [row.date, true]))
}

async function setCrisisToday(dateKey, active) {
  if (!supabaseConfigured) return local.setCrisisToday(dateKey, active)
  const uid = await currentUserId()
  if (active) {
    const { error } = await supabase.from('crisis_log').upsert({ user_id: uid, date: dateKey })
    if (error) throw error
  } else {
    const { error } = await supabase.from('crisis_log').delete().eq('user_id', uid).eq('date', dateKey)
    if (error) throw error
  }
}

// ---- Evening check-in ----

async function getEveningLog() {
  if (!supabaseConfigured) return local.getEveningLog()
  const uid = await currentUserId()
  const { data, error } = await supabase
    .from('evening_log')
    .select('date, answer, created_at')
    .eq('user_id', uid)
    .order('date', { ascending: false })
    .limit(90)
  if (error) throw error
  return data.map((row) => ({ date: row.date, answer: row.answer, at: row.created_at }))
}

async function setTodayEveningEntry(dateKey, answer) {
  if (!supabaseConfigured) return local.setTodayEveningEntry(dateKey, answer)
  const uid = await currentUserId()
  const { error } = await supabase
    .from('evening_log')
    .upsert({ user_id: uid, date: dateKey, answer, created_at: new Date().toISOString() })
  if (error) throw error
}

// ---- Research history ----

async function getHistory() {
  if (!supabaseConfigured) return local.getHistory()
  const uid = await currentUserId()
  const { data, error } = await supabase
    .from('research_history')
    .select('question, answer, flagged_medical, created_at')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data.map((row) => ({
    question: row.question,
    answer: row.answer,
    flaggedMedical: row.flagged_medical,
    at: row.created_at,
  }))
}

async function addHistoryEntry(entry) {
  if (!supabaseConfigured) return local.addHistoryEntry(entry)
  const uid = await currentUserId()
  const { error } = await supabase.from('research_history').insert({
    user_id: uid,
    question: entry.question,
    answer: entry.answer,
    flagged_medical: entry.flaggedMedical,
    created_at: entry.at,
  })
  if (error) throw error
}

// ---- Travel mode ----

async function getTravelMode() {
  if (!supabaseConfigured) return !!local.getSettings().travelMode
  const uid = await currentUserId()
  const { data, error } = await supabase.from('settings').select('travel_mode').eq('id', uid).maybeSingle()
  if (error) throw error
  return !!data?.travel_mode
}

async function setTravelMode(active) {
  if (!supabaseConfigured) return local.setSettings({ ...local.getSettings(), travelMode: active })
  const uid = await currentUserId()
  const { error } = await supabase
    .from('settings')
    .upsert({ id: uid, travel_mode: active, updated_at: new Date().toISOString() })
  if (error) throw error
}

// ---- Export / delete ----

async function exportAll() {
  if (!supabaseConfigured) return local.exportAll()
  const [profile, plan, goals, projects, energyLog, crisisLog, eveningLog, completionLog, history, travelMode] =
    await Promise.all([
      getProfile(),
      getPlan(),
      getGoals(),
      getProjects(),
      getEnergyLog(),
      getCrisisLog(),
      getEveningLog(),
      getCompletionLog(),
      getHistory(),
      getTravelMode(),
    ])
  return {
    profile,
    plan,
    goals,
    projects,
    energyLog,
    crisisLog,
    eveningLog,
    completionLog,
    history,
    travelMode,
    exportedAt: new Date().toISOString(),
  }
}

// Clears this account's data (not the auth account itself — deleting the
// login requires a server-side admin action, out of scope here) and signs
// out so the person lands back on onboarding.
async function clearAll() {
  if (!supabaseConfigured) return local.clearAll()
  const uid = await currentUserId()
  await Promise.all([
    supabase.from('goals').delete().eq('user_id', uid),
    supabase.from('projects').delete().eq('user_id', uid),
    supabase.from('energy_log').delete().eq('user_id', uid),
    supabase.from('crisis_log').delete().eq('user_id', uid),
    supabase.from('evening_log').delete().eq('user_id', uid),
    supabase.from('completion_log').delete().eq('user_id', uid),
    supabase.from('research_history').delete().eq('user_id', uid),
    supabase.from('weekly_plans').delete().eq('user_id', uid),
  ])
  await supabase
    .from('profiles')
    .update({ name: null, goals: null, routine: null, work: null, health_notes: null })
    .eq('id', uid)
  await supabase.auth.signOut()
}

// One-time migration for anyone who used the local-only version before
// creating an account: copies whatever is in this browser's localStorage
// into the newly created cloud account, then leaves local storage untouched
// (it's simply superseded once the cloud account is the source of truth).
async function importFromLocal() {
  if (!supabaseConfigured) return
  const localProfile = local.getProfile()
  if (!localProfile) return false

  await setProfile(localProfile)
  const localPlan = local.getPlan()
  if (localPlan) await setPlan(localPlan)

  const goals = local.getGoals()
  if (goals.length) await setGoals(goals)

  const projects = local.getProjects()
  if (projects.length) await setProjects(projects)

  const energyLog = local.getEnergyLog()
  await Promise.all(Object.entries(energyLog).map(([date, level]) => setTodayEnergy(date, level)))

  const crisisLog = local.getCrisisLog()
  await Promise.all(Object.keys(crisisLog).map((date) => setCrisisToday(date, true)))

  const eveningLog = local.getEveningLog()
  await Promise.all(eveningLog.map((e) => setTodayEveningEntry(e.date, e.answer)))

  const completionLog = local.getCompletionLog()
  await Promise.all(Object.entries(completionLog).map(([date, completed]) => setCompletedToday(date, completed)))

  const history = local.getHistory()
  await Promise.all([...history].reverse().map((entry) => addHistoryEntry(entry)))

  const settings = local.getSettings()
  if (settings.travelMode) await setTravelMode(true)

  return true
}

export const db = {
  getProfile,
  hasProfile,
  setProfile,
  getPlan,
  setPlan,
  getCompletionLog,
  getCompletedToday,
  setCompletedToday,
  getGoals,
  setGoals,
  getProjects,
  setProjects,
  getEnergyLog,
  setTodayEnergy,
  getCrisisLog,
  setCrisisToday,
  getEveningLog,
  setTodayEveningEntry,
  getHistory,
  addHistoryEntry,
  getTravelMode,
  setTravelMode,
  exportAll,
  clearAll,
  importFromLocal,
}
