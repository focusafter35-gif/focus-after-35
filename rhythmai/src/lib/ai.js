import { storage } from './storage.js'
import { looksMedical, MEDICAL_DISCLAIMER_AR, SAFETY_SYSTEM_PROMPT } from './safety.js'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-5'

// RhythmAI calls the Anthropic API directly from your browser using the API key
// you paste into Settings. The key is stored only in this browser's localStorage
// and is sent only to Anthropic — never to any RhythmAI server, because there is none.
async function callClaude({ system, messages, maxTokens = 1200 }) {
  const { apiKey } = storage.getSettings()
  if (!apiKey) {
    const err = new Error('NO_API_KEY')
    err.code = 'NO_API_KEY'
    throw err
  }

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
      system,
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
    `الاسم: ${profile.name || 'غير محدد'}`,
    `الأهداف: ${profile.goals || 'غير محددة'}`,
    `الروتين الحالي: ${profile.routine || 'غير محدد'}`,
    `العمل/الدراسة: ${profile.work || 'غير محدد'}`,
    `ملاحظات صحية عامة (غير تشخيصية): ${profile.healthNotes || 'لا شيء'}`,
    `النبرة المفضلة للتذكيرات: ${profile.tone || 'لطيفة'}`,
  ].join('\n')
}

// ---- Weekly plan ----

export async function generateWeeklyPlan(profile) {
  try {
    const raw = await callClaude({
      system: SAFETY_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `بناءً على ملفي الشخصي التالي، اقترح خطة أسبوعية (7 أيام) بسيطة وواقعية لمساعدتي على تحقيق أهدافي. لكل يوم اذكر 2-4 مهام قصيرة فقط.
أعد الإجابة بصيغة JSON فقط بدون أي نص إضافي، بالشكل التالي:
{"days": [{"day": "السبت", "tasks": ["مهمة 1", "مهمة 2"]}, ...]}

ملفي الشخصي:
${profileSummary(profile)}`,
        },
      ],
    })
    const parsed = extractJson(raw)
    if (parsed?.days) return { source: 'ai', days: parsed.days }
    throw new Error('bad-format')
  } catch (e) {
    return { source: 'fallback', days: fallbackPlan(profile), error: e.code }
  }
}

function fallbackPlan(profile) {
  const goals = (profile?.goals || 'الصحة، التركيز، الراحة').split(/[,،]/).map((s) => s.trim()).filter(Boolean)
  const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
  const pool = [
    'خصص 20 دقيقة صباحًا لهدفك الأهم اليوم',
    'استراحة قصيرة بلا شاشات (10 دقائق)',
    'اشرب ماء كافي وتحرك قليلاً بعد الظهر',
    `اعمل على: ${goals[0] || 'هدفك الرئيسي'}`,
    'راجع يومك في 5 دقائق قبل النوم',
    'وقت هادئ لنفسك بدون التزامات',
  ]
  return days.map((day, i) => ({
    day,
    tasks: [pool[i % pool.length], pool[(i + 2) % pool.length], i % 3 === 0 ? 'يوم أخف — راحة مستحقة' : pool[(i + 4) % pool.length]],
  }))
}

// ---- Research ----

export async function askResearch(question, profile) {
  const flaggedMedical = looksMedical(question)
  try {
    const raw = await callClaude({
      system: SAFETY_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `ابحث بعمق وأجب باختصار ووضوح على السؤال التالي، بشكل مفيد وعملي. إن كان السؤال متعلقًا بالتغذية أو النوم أو الإنتاجية أو العمل فقدم نصائح عملية. إن كان سؤالًا صحيًا جديًا التزم بقواعد السلامة تمامًا.

السؤال: ${question}

سياق موجز عني (اختياري، استخدمه فقط إن كان مفيدًا): ${profileSummary(profile)}`,
        },
      ],
    })
    return { source: 'ai', answer: raw, flaggedMedical }
  } catch (e) {
    return { source: 'fallback', answer: fallbackAnswer(question, flaggedMedical), flaggedMedical, error: e.code }
  }
}

function fallbackAnswer(question, flaggedMedical) {
  if (flaggedMedical) {
    return 'لا أستطيع تقديم إجابة موثوقة بدون اتصال بالذكاء الاصطناعي حاليًا. أضف مفتاح API الخاص بك في الإعدادات لتفعيل البحث العميق.'
  }
  return 'لتفعيل البحث العميق والإجابات المخصصة، أضف مفتاح Anthropic API الخاص بك من صفحة الإعدادات. بياناتك ومفتاحك يبقيان في متصفحك فقط.'
}

// ---- Goal breakdown ----

export async function breakdownGoal(title, why, profile) {
  try {
    const raw = await callClaude({
      system: SAFETY_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `اكسر الهدف التالي إلى 4-6 خطوات عملية وقابلة للتنفيذ فعليًا (وليست عامة).
أعد الإجابة بصيغة JSON فقط بدون أي نص إضافي: {"steps": ["خطوة 1", "خطوة 2", ...]}

الهدف: ${title}
${why ? `لماذا هذا الهدف مهم لي: ${why}` : ''}

سياق موجز عني: ${profileSummary(profile)}`,
        },
      ],
      maxTokens: 500,
    })
    const parsed = extractJson(raw)
    if (parsed?.steps?.length) return { source: 'ai', steps: parsed.steps }
    throw new Error('bad-format')
  } catch (e) {
    return { source: 'fallback', steps: fallbackSteps(title), error: e.code }
  }
}

function fallbackSteps(title) {
  return [
    `حدد بوضوح لماذا "${title}" مهم لك الآن`,
    'اختر أول خطوة صغيرة يمكن إنجازها خلال اليومين القادمين',
    'خصص وقتًا ثابتًا أسبوعيًا لهذا الهدف في خطتك',
    'تتبع تقدمك كل أسبوع وعدّل ما لا ينفع',
    'احتفل بأي تقدم، مهما كان صغيرًا',
  ]
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

export { MEDICAL_DISCLAIMER_AR }
