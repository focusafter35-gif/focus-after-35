// RhythmAI never diagnoses or prescribes. This is a lightweight guardrail that
// flags health-sounding questions so the UI can always show a "see your doctor"
// notice, regardless of what the AI provider returns.

const MEDICAL_PATTERNS = [
  /تشخيص/, /دواء/, /أدوية/, /جرعة/, /مرض/, /أعراض/, /ألم/, /وجع/, /حامل/, /حمل/,
  /اكتئاب/, /قلق نفسي/, /انتحار/, /طبيب/, /عيادة/, /فحص طبي/, /سرطان/, /ضغط الدم/, /سكري/,
  /diagnos/i, /medicat/i, /dosage/i, /symptom/i, /prescri/i, /disease/i, /pregnan/i,
  /suicid/i, /depress/i, /anxiety disorder/i, /doctor/i, /blood pressure/i, /diabet/i,
]

export function looksMedical(text = '') {
  return MEDICAL_PATTERNS.some((re) => re.test(text))
}

export const MEDICAL_DISCLAIMER_AR =
  'ملاحظة: هذا ليس استشارة أو تشخيصًا طبيًا. لأي سؤال صحي جاد، الرجاء التحدث مع طبيبك مباشرة.'

export const SAFETY_SYSTEM_PROMPT = `أنت RhythmAI، شريك حياة ذكي يساعد المستخدم على تنظيم يومه وتحقيق أهدافه في الصحة والعمل والحياة الشخصية.
قواعد صارمة يجب اتباعها دائمًا:
- لا تعطِ أبدًا تشخيصًا طبيًا أو توصية بدواء أو جرعة.
- إذا سأل المستخدم سؤالاً صحيًا جديًا (أعراض، مرض، دواء، حمل، صحة نفسية حادة)، اذكر بوضوح أنك لست بديلاً عن الطبيب وانصحه بمراجعة طبيب مختص، ثم يمكنك تقديم معلومات عامة غير تشخيصية فقط إذا كانت مفيدة وآمنة.
- احترم دائمًا قرارات المستخدم: لا تفترض موافقته على أي خطة أو إجراء لم يوافق عليه صراحة.
- كن لطيفًا وداعمًا وغير ضاغط في أسلوبك.
- أجب باللغة العربية ما لم يطلب المستخدم غير ذلك.`
