import { storage } from './storage.js'
import { looksMedical, SAFETY_SYSTEM_PROMPT } from './safety.js'
import { LANGUAGE_NAMES_EN } from '../i18n/languages.js'
import { weekdayNames } from './dates.js'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-5'

// RhythmAI calls the Anthropic API directly from your browser using the API key
// you paste into Settings. The key is stored only in this browser's localStorage
// and is sent only to Anthropic — never to any RhythmAI server, because there is none.
async function callClaude({ system, messages, maxTokens = 1200, lang }) {
  const { apiKey } = storage.getSettings()
  if (!apiKey) {
    const err = new Error('NO_API_KEY')
    err.code = 'NO_API_KEY'
    throw err
  }

  const languageName = LANGUAGE_NAMES_EN[lang] || 'English'
  const fullSystem = `${system}\n\nRespond only in ${languageName}.`

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: fullSystem,
      messages,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(`Anthropic API error ${res.status}: ${text}`)
    err.code = 'API_ERROR'
    throw err
  }

  const data = await res.json()
  return data.content?.map((b) => b.text).join('\n') ?? ''
}

function profileSummary(profile) {
  if (!profile) return ''
  return [
    `Name: ${profile.name || 'unspecified'}`,
    `Goals: ${profile.goals || 'unspecified'}`,
    `Current routine: ${profile.routine || 'unspecified'}`,
    `Work/studies: ${profile.work || 'unspecified'}`,
    `General health notes (non-diagnostic): ${profile.healthNotes || 'none'}`,
    `Preferred reminder tone: ${profile.tone || 'gentle'}`,
  ].join('\n')
}

// ---- Weekly plan ----

export async function generateWeeklyPlan(profile, lang) {
  const names = weekdayNames(lang)
  try {
    const raw = await callClaude({
      system: SAFETY_SYSTEM_PROMPT,
      lang,
      messages: [
        {
          role: 'user',
          content: `Based on my profile below, suggest a realistic, simple weekly plan (7 days, starting Sunday). For each day list only 2-4 short tasks.
Reply with JSON only, no extra text, in this shape:
{"days": [{"tasks": ["task 1", "task 2"]}, ...]} — exactly 7 entries, in order starting Sunday.

My profile:
${profileSummary(profile)}`,
        },
      ],
    })
    const parsed = extractJson(raw)
    if (parsed?.days?.length) {
      return { source: 'ai', days: normalizeDays(parsed.days, names) }
    }
    throw new Error('bad-format')
  } catch (e) {
    return { source: 'fallback', days: fallbackPlan(profile, lang, names), error: e.code }
  }
}

function normalizeDays(days, names) {
  return names.map((day, i) => ({ day, tasks: days[i]?.tasks?.length ? days[i].tasks : [] }))
}

const FALLBACK_PLAN_POOL = {
  en: {
    items: [
      'Spend 20 focused minutes each morning on your top goal for the day',
      'Take a short screen-free break (10 minutes)',
      'Drink enough water and move a little in the afternoon',
      'Work on: {goal}',
      'Review your day for 5 minutes before bed',
      'Quiet time for yourself, no obligations',
    ],
    lightDay: 'Lighter day — a well-earned rest',
    defaultGoal: 'health, focus, and rest',
  },
  ar: {
    items: [
      'خصص 20 دقيقة صباحًا لهدفك الأهم اليوم',
      'استراحة قصيرة بلا شاشات (10 دقائق)',
      'اشرب ماء كافي وتحرك قليلاً بعد الظهر',
      'اعمل على: {goal}',
      'راجع يومك في 5 دقائق قبل النوم',
      'وقت هادئ لنفسك بدون التزامات',
    ],
    lightDay: 'يوم أخف — راحة مستحقة',
    defaultGoal: 'الصحة، التركيز، الراحة',
  },
  fr: {
    items: [
      'Consacrez 20 minutes chaque matin à votre objectif principal du jour',
      'Faites une courte pause sans écran (10 minutes)',
      "Buvez suffisamment d'eau et bougez un peu l'après-midi",
      'Travaillez sur : {goal}',
      'Passez en revue votre journée pendant 5 minutes avant de dormir',
      'Un moment calme pour vous, sans obligations',
    ],
    lightDay: 'Journée plus légère — un repos bien mérité',
    defaultGoal: 'la santé, la concentration et le repos',
  },
  es: {
    items: [
      'Dedique 20 minutos cada mañana a su objetivo principal del día',
      'Tome un breve descanso sin pantallas (10 minutos)',
      'Beba suficiente agua y muévase un poco por la tarde',
      'Trabaje en: {goal}',
      'Revise su día durante 5 minutos antes de dormir',
      'Tiempo tranquilo para usted, sin obligaciones',
    ],
    lightDay: 'Día más ligero — un descanso merecido',
    defaultGoal: 'la salud, el enfoque y el descanso',
  },
  zh: {
    items: [
      '每天早晨花20分钟专注于当日最重要的目标',
      '短暂休息10分钟，远离屏幕',
      '下午多喝水、稍作活动',
      '专注于：{goal}',
      '睡前用5分钟回顾今天',
      '给自己一段安静的时间，不受任何约束',
    ],
    lightDay: '轻松的一天——应得的休息',
    defaultGoal: '健康、专注与休息',
  },
  ru: {
    items: [
      'Каждое утро уделяйте 20 минут своей главной цели на день',
      'Сделайте короткий перерыв без экранов (10 минут)',
      'Пейте достаточно воды и немного подвигайтесь днём',
      'Поработайте над: {goal}',
      'Уделите 5 минут вечером, чтобы подвести итоги дня',
      'Спокойное время для себя, без обязательств',
    ],
    lightDay: 'Более лёгкий день — заслуженный отдых',
    defaultGoal: 'здоровье, концентрацию и отдых',
  },
}

function fallbackPlan(profile, lang, names) {
  const pack = FALLBACK_PLAN_POOL[lang] || FALLBACK_PLAN_POOL.en
  const goals = (profile?.goals || pack.defaultGoal).split(/[,،]/).map((s) => s.trim()).filter(Boolean)
  const pool = pack.items.map((s) => s.replace('{goal}', goals[0] || pack.defaultGoal))
  return names.map((day, i) => ({
    day,
    tasks: [pool[i % pool.length], pool[(i + 2) % pool.length], i % 3 === 0 ? pack.lightDay : pool[(i + 4) % pool.length]],
  }))
}

// ---- Research ----

export async function askResearch(question, profile, lang) {
  const flaggedMedical = looksMedical(question)
  try {
    const raw = await callClaude({
      system: SAFETY_SYSTEM_PROMPT,
      lang,
      messages: [
        {
          role: 'user',
          content: `Research and answer the following question clearly and concisely, in a useful and practical way. If it relates to nutrition, sleep, productivity, or work, give practical advice. If it is a serious health question, follow the safety rules strictly.

Question: ${question}

Brief context about me (optional, use only if helpful): ${profileSummary(profile)}`,
        },
      ],
    })
    return { source: 'ai', answer: raw, flaggedMedical }
  } catch (e) {
    return { source: 'fallback', flaggedMedical, error: e.code }
  }
}

// ---- Goal breakdown ----

export async function breakdownGoal(title, why, profile, lang) {
  try {
    const raw = await callClaude({
      system: SAFETY_SYSTEM_PROMPT,
      lang,
      maxTokens: 500,
      messages: [
        {
          role: 'user',
          content: `Break the following goal into 4-6 concrete, actionable steps (not generic advice).
Reply with JSON only, no extra text: {"steps": ["step 1", "step 2", ...]}

Goal: ${title}
${why ? `Why this goal matters to me: ${why}` : ''}

Brief context about me: ${profileSummary(profile)}`,
        },
      ],
    })
    const parsed = extractJson(raw)
    if (parsed?.steps?.length) return { source: 'ai', steps: parsed.steps }
    throw new Error('bad-format')
  } catch (e) {
    return { source: 'fallback', steps: fallbackSteps(title, lang), error: e.code }
  }
}

const FALLBACK_STEPS = {
  en: (title) => [
    `Clarify why "${title}" matters to you right now`,
    'Choose one small first step you can complete within the next two days',
    'Set aside a fixed weekly time for this goal in your plan',
    "Track your progress each week and adjust what isn't working",
    'Celebrate any progress, however small',
  ],
  ar: (title) => [
    `حدد بوضوح لماذا "${title}" مهم لك الآن`,
    'اختر أول خطوة صغيرة يمكن إنجازها خلال اليومين القادمين',
    'خصص وقتًا ثابتًا أسبوعيًا لهذا الهدف في خطتك',
    'تتبع تقدمك كل أسبوع وعدّل ما لا ينفع',
    'احتفل بأي تقدم، مهما كان صغيرًا',
  ],
  fr: (title) => [
    `Clarifiez pourquoi « ${title} » compte pour vous en ce moment`,
    'Choisissez un premier petit pas réalisable dans les deux prochains jours',
    'Réservez un créneau hebdomadaire fixe pour cet objectif dans votre plan',
    'Suivez vos progrès chaque semaine et ajustez ce qui ne fonctionne pas',
    'Célébrez chaque progrès, aussi petit soit-il',
  ],
  es: (title) => [
    `Aclare por qué "${title}" le importa ahora mismo`,
    'Elija un primer paso pequeño que pueda completar en los próximos dos días',
    'Reserve un horario semanal fijo para este objetivo en su plan',
    'Haga seguimiento de su progreso cada semana y ajuste lo que no funcione',
    'Celebre cualquier progreso, por pequeño que sea',
  ],
  zh: (title) => [
    `明确"${title}"现在对您为何重要`,
    '选择一个可在两天内完成的小步骤',
    '在您的计划中为此目标固定每周时间',
    '每周跟踪进度并调整无效的部分',
    '为任何进步而庆祝，无论多小',
  ],
  ru: (title) => [
    `Уточните, почему «${title}» важно для вас сейчас`,
    'Выберите один небольшой первый шаг, который можно выполнить в течение двух дней',
    'Выделите фиксированное время в неделю для этой цели в своём плане',
    'Отслеживайте прогресс каждую неделю и корректируйте то, что не работает',
    'Отмечайте любой прогресс, каким бы малым он ни был',
  ],
}

function fallbackSteps(title, lang) {
  const fn = FALLBACK_STEPS[lang] || FALLBACK_STEPS.en
  return fn(title)
}

// ---- Weekly report narrative ----

export async function generateWeeklyReport(stats, profile, lang) {
  try {
    const raw = await callClaude({
      system: SAFETY_SYSTEM_PROMPT,
      lang,
      maxTokens: 500,
      messages: [
        {
          role: 'user',
          content: `Here is a summary of my past week of activity in the app:
- Planned tasks: ${stats.totalPlanned}, completed: ${stats.totalCompleted}
- Energy check-ins: low ${stats.energyCounts.low}, medium ${stats.energyCounts.medium}, high ${stats.energyCounts.high}
- Evening reflections logged: ${stats.eveningCount} out of the last 7 days

My profile:
${profileSummary(profile)}

Write a short, warm 3-4 sentence weekly summary covering: what improved, what might need adjustment, and one encouraging observation. Do not invent facts beyond what is given above. Do not give medical advice.`,
        },
      ],
    })
    return { source: 'ai', text: raw }
  } catch (e) {
    return { source: 'fallback', error: e.code }
  }
}

function extractJson(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    return JSON.parse(match[0])
  } catch {
    return null
  }
}
