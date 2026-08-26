import { todayKey, weekdayNames, dateFromKey } from './dates.js'

const ENERGY_SCORE = { low: 1, medium: 2, high: 3 }

function dateKeysBack(n, from = new Date()) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(from)
    d.setDate(d.getDate() - (n - 1 - i))
    return todayKey(d)
  })
}

// ---- This week's summary (relies on the current plan, so only meaningful
// while that plan is still the one that was active on each day) ----

export function computeWeekSummary({ plan, completionLog, energyLog, eveningLog }, lang) {
  const keys = dateKeysBack(7)
  const labels = weekdayNames(lang)
  const todayIdx = keys.length - 1

  const days = keys.map((dateKey, i) => {
    const weekdayIndex = dateFromKey(dateKey).getDay()
    const planned = plan?.days?.[weekdayIndex]?.tasks || []
    const completed = completionLog[dateKey] || []
    const completedCount = Math.min(completed.length, planned.length)
    return {
      dateKey,
      weekdayLabel: labels[weekdayIndex],
      planned: planned.length,
      completed: completedCount,
      rate: planned.length ? completedCount / planned.length : null,
      energy: energyLog[dateKey] || null,
      hasEvening: eveningLog.some((e) => e.date === dateKey),
      isFuture: i > todayIdx,
    }
  })

  const withPlan = days.filter((d) => d.planned > 0)
  const totalPlanned = withPlan.reduce((s, d) => s + d.planned, 0)
  const totalCompleted = withPlan.reduce((s, d) => s + d.completed, 0)

  const energyCounts = { low: 0, medium: 0, high: 0 }
  days.forEach((d) => {
    if (d.energy) energyCounts[d.energy] += 1
  })

  const eveningCount = days.filter((d) => d.hasEvening).length

  return {
    days,
    totalPlanned,
    totalCompleted,
    completionRate: totalPlanned ? totalCompleted / totalPlanned : null,
    energyCounts,
    eveningCount,
  }
}

function mostCommonEnergy(energyCounts) {
  const entries = Object.entries(energyCounts).filter(([, v]) => v > 0)
  if (!entries.length) return null
  return entries.sort((a, b) => b[1] - a[1])[0][0]
}

export { mostCommonEnergy }

// ---- Patterns detected from the full local history (not just this week) ----

export function detectPatterns({ energyLog, completionLog, eveningLog, goals }, lang, t) {
  const patterns = []
  const labels = weekdayNames(lang)

  // 1. Energy tends to be higher on a given weekday (needs real spread of data).
  const byWeekday = Array.from({ length: 7 }, () => [])
  Object.entries(energyLog).forEach(([dateKey, level]) => {
    const idx = dateFromKey(dateKey).getDay()
    byWeekday[idx].push(ENERGY_SCORE[level] || 2)
  })
  const overallSamples = byWeekday.flat()
  if (overallSamples.length >= 6) {
    const overallAvg = overallSamples.reduce((a, b) => a + b, 0) / overallSamples.length
    let best = null
    byWeekday.forEach((samples, idx) => {
      if (samples.length < 2) return
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length
      if (avg - overallAvg >= 0.5 && (!best || avg > best.avg)) {
        best = { idx, avg }
      }
    })
    if (best) {
      patterns.push(t('insights.energyByWeekday', { weekday: labels[best.idx] }))
    }
  }

  // 2. Task engagement is higher on high-energy days than low-energy days.
  const completionByEnergy = { low: [], high: [] }
  Object.entries(energyLog).forEach(([dateKey, level]) => {
    if (level !== 'low' && level !== 'high') return
    const count = (completionLog[dateKey] || []).length
    completionByEnergy[level].push(count)
  })
  if (completionByEnergy.low.length >= 2 && completionByEnergy.high.length >= 2) {
    const avgLow = completionByEnergy.low.reduce((a, b) => a + b, 0) / completionByEnergy.low.length
    const avgHigh = completionByEnergy.high.reduce((a, b) => a + b, 0) / completionByEnergy.high.length
    if (avgHigh - avgLow >= 0.5) {
      patterns.push(
        t('insights.engagementHighEnergy', { high: avgHigh.toFixed(1), low: avgLow.toFixed(1) })
      )
    }
  }

  // 3. Evening reflection streak (consecutive days ending today or yesterday).
  const eveningDates = new Set(eveningLog.map((e) => e.date))
  let streak = 0
  for (let i = 0; i < 60; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if (eveningDates.has(todayKey(d))) streak += 1
    else break
  }
  if (streak >= 3) {
    patterns.push(t('insights.eveningStreak', { count: streak }))
  }

  // 4. Overall goal momentum.
  const allSteps = goals.flatMap((g) => g.steps)
  if (allSteps.length >= 3) {
    const donePct = Math.round((allSteps.filter((s) => s.done).length / allSteps.length) * 100)
    patterns.push(t('insights.goalMomentum', { percent: donePct }))
  }

  return patterns
}
