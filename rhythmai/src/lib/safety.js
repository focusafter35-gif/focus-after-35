// RhythmAI never diagnoses or prescribes. This is a lightweight guardrail that
// flags health-sounding questions so the UI can always show a "see your doctor"
// notice, regardless of what the AI provider returns. Keyword lists cover all
// six supported languages since a user may type in any of them.

const MEDICAL_PATTERNS = [
  // English
  /diagnos/i, /medicat/i, /dosage/i, /symptom/i, /prescri/i, /disease/i, /pregnan/i,
  /suicid/i, /depress/i, /anxiety disorder/i, /doctor/i, /blood pressure/i, /diabet/i, /cancer/i,
  // Arabic
  /تشخيص/, /دواء/, /أدوية/, /جرعة/, /مرض/, /أعراض/, /ألم/, /وجع/, /حامل/, /حمل/,
  /اكتئاب/, /قلق نفسي/, /انتحار/, /طبيب/, /عيادة/, /فحص طبي/, /سرطان/, /ضغط الدم/, /سكري/,
  // French
  /diagnostic/i, /médicament/i, /posologie/i, /symptôme/i, /ordonnance/i, /maladie/i, /enceinte/i,
  /suicid/i, /dépression/i, /anxiété/i, /médecin/i, /tension artérielle/i, /diabète/i, /cancer/i,
  // Spanish
  /diagnóstico/i, /medicamento/i, /dosis/i, /síntoma/i, /receta médica/i, /enfermedad/i, /embarazo/i,
  /depresión/i, /ansiedad/i, /médico/i, /presión arterial/i, /diabetes/i,
  // Chinese
  /诊断/, /药物/, /剂量/, /症状/, /处方/, /疾病/, /怀孕/, /抑郁/, /焦虑症/, /医生/, /血压/, /糖尿病/, /癌症/,
  // Russian
  /диагноз/i, /лекарств/i, /дозировк/i, /симптом/i, /рецепт/i, /болезн/i, /беременн/i,
  /депресси/i, /тревожн/i, /врач/i, /давлени/i, /диабет/i, /рак/i,
]

export function looksMedical(text = '') {
  return MEDICAL_PATTERNS.some((re) => re.test(text))
}

export const SAFETY_SYSTEM_PROMPT = `You are RhythmAI, an intelligent life partner that helps the user organize their day and reach their goals in health, work, and personal life.
Strict rules you must always follow:
- Never provide a medical diagnosis or recommend a specific medication or dosage.
- If the user asks a serious health question (symptoms, disease, medication, pregnancy, acute mental health concerns), clearly state that you are not a substitute for a doctor and recommend they consult one, then you may share general, non-diagnostic information only if it is safe and useful.
- Always respect the user's decisions: never assume approval for any plan or action they have not explicitly approved.
- Be warm, supportive, and never pressuring in tone.
- Respond only in the language specified below, regardless of the language of the input.`

export { MEDICAL_PATTERNS }
