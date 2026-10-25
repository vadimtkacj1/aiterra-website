export type Answer = 'yes' | 'no' | 'unsure'

export type Answers = Partial<Record<string, Answer>>

export type DutyId = 'registration' | 'notification' | 'officer'

export type DutyStatus = 'required' | 'check' | 'notRequired'

export type QuizQuestion = {
  id: string
  question: string
  hint: string
  basis: string
  visible: (answers: Answers) => boolean
}

export type Duty = {
  id: DutyId
  title: string
  basis: string
  status: DutyStatus
  reasons: string[]
  next: string
}

export type QuizResult = {
  duties: Duty[]
  visibleCount: number
  answeredCount: number
  complete: boolean
  outOfScope: boolean
}

const always = () => true

const inScope = (answers: Answers) => answers.business !== 'no' && answers.contactOnly !== 'yes'

export const questions: QuizQuestion[] = [
  {
    id: 'business',
    question: 'אתם מחזיקים ומעבדים באמצעים דיגיטליים מידע אישי על לקוחות, פונים, מנויים או עובדים, לצורכי העסק או הגוף?',
    hint: 'גם גיליון אקסל, CRM, רשימת תפוצה או טפסים באתר. אוסף לשימוש אישי שאינו למטרות עסק לא נחשב מאגר מידע.',
    basis: 'סעיף 3 לחוק, ההגדרה ״מאגר מידע״.',
    visible: always,
  },
  {
    id: 'contactOnly',
    question:
      'האוסף כולל רק שם, מען ודרכי התקשרות, על 100,000 אנשים או פחות, והרשימה לא מלמדת בעצמה דבר נוסף עליהם? ואין לכם או לתאגיד בשליטתכם אוסף אחר עם פרטים נוספים על אותם אנשים?',
    hint: 'למשל רשימת תפוצה בלבד. אם יש גם היסטוריית רכישות, הערות, פרטי תשלום או כל מידע אחר על אותם אנשים, ענו ״לא״.',
    basis: 'סעיף 3 לחוק, ההגדרה ״מאגר מידע״, פסקה (2): אוסף כזה אינו נחשב מאגר מידע.',
    visible: (answers) => answers.business !== 'no',
  },
  {
    id: 'public',
    question: 'אתם גוף ציבורי כהגדרתו בסעיף 23 לחוק?',
    hint: 'משרד ממשלתי או מוסד מדינה אחר, רשות מקומית, או גוף אחר שממלא תפקידים ציבוריים על פי דין. חברה עסקית רגילה אינה כזו.',
    basis: 'סעיף 23 לחוק, ההגדרה ״גוף ציבורי״.',
    visible: inScope,
  },
  {
    id: 'publicEmployeesOnly',
    question: 'המידע במאגר הוא רק על עובדי הגוף הציבורי עצמו?',
    hint: 'אם יש במאגר גם מידע על אזרחים, על מבקשי שירות או על אנשים אחרים, ענו ״לא״.',
    basis: 'סעיף 8א(א)(1)(ב): גוף ציבורי חייב ברישום, אלא אם המאגר כולל מידע על עובדי הגוף הציבורי בלבד.',
    visible: (answers) => inScope(answers) && answers.public === 'yes',
  },
  {
    id: 'broker',
    question: 'המטרה העיקרית של המאגר היא לאסוף מידע אישי כדי למסור אותו לאחרים, כדרך עיסוק או בתמורה, כולל מתן שירותי דיוור ישיר?',
    hint: 'למשל מכירת רשימות לידים או רשימות תפוצה, או שליחת דיוור בשם לקוחות. לפי לשון הסעיף המידע צריך להימסר לאחר. עסק ששולח הצעות משלו ללקוחות שלו אינו מוסר אותן לאחר.',
    basis: 'סעיף 8א(א)(1)(א) וסעיף 17ב1(א)(2).',
    visible: inScope,
  },
  {
    id: 'brokerScale',
    question: 'במאגר הזה יש מידע אישי על יותר מ-10,000 בני אדם?',
    hint: 'סופרים אנשים ולא רשומות. מי שנמצא במאגר פעמיים נספר פעם אחת.',
    basis: 'סעיף 8א(א)(1)(א) וסעיף 17ב1(א)(2): הסף הוא יותר מ-10,000 בני אדם.',
    visible: (answers) => inScope(answers) && answers.broker !== 'no',
  },
  {
    id: 'sensitive',
    question: 'אתם מחזיקים מידע בעל רגישות מיוחדת?',
    hint: 'מידע על מצב בריאותי, מידע גנטי, מזהה ביומטרי לזיהוי או אימות, מוצא, עבר פלילי, דעות פוליטיות, אמונות דתיות או השקפת עולם, צנעת חיי משפחה ואישות, נטייה מינית, הערכת אישיות, נתוני שכר ופעילות פיננסית, או מידע שחלה עליו חובת סודיות בדין.',
    basis: 'סעיף 3 לחוק, ההגדרה ״מידע בעל רגישות מיוחדת״.',
    visible: inScope,
  },
  {
    id: 'sensitiveScale',
    question: 'יש מידע כזה על יותר מ-100,000 בני אדם במאגר?',
    hint: 'סופרים אנשים ולא רשומות. הסף נבחן לגבי מאגר מידע אחד.',
    basis: 'סעיף 8א(ב): הודעה לרשות כשהמידע הרגיש במאגר שאינו חייב ברישום עולה על 100,000 בני אדם.',
    visible: (answers) => inScope(answers) && answers.sensitive !== 'no',
  },
  {
    id: 'sensitiveMain',
    question: 'העיסוק העיקרי שלכם כולל עיבוד של מידע רגיש כזה בהיקף ניכר?',
    hint: 'ההגדרה נותנת כדוגמה תאגיד בנקאי, מבטח, בית חולים כללי וקופת חולים. ההיקף נבחן לפי מספר האנשים, שיעורם באוכלוסייה, כמות המידע וסוגיו, משך ותדירות העיבוד ומשך השמירה.',
    basis: 'סעיף 17ב1(א)(4) ו-17ב1(ב).',
    visible: (answers) => inScope(answers) && answers.sensitive !== 'no',
  },
  {
    id: 'monitoring',
    question: 'העיסוק העיקרי שלכם דורש ניטור שוטף ושיטתי של אנשים בהיקף ניכר, כמו מעקב אחר התנהגותם, מיקומם או פעולותיהם?',
    hint: 'החוק נותן כדוגמה ספק מורשה של שירות רדיו טלפון נייד וספק שירות חיפוש מקוון. מדידת גלישה רגילה באתר עסקי היא בדרך כלל לא עיסוק עיקרי בהיקף כזה, אבל אם זה עיקר העיסוק שלכם, ענו ״כן״ או ״לא יודע״.',
    basis: 'סעיף 17ב1(א)(3) ו-17ב1(ב).',
    visible: inScope,
  },
]

const questionById = (id: string) => questions.find((question) => question.id === id)

export const visibleQuestions = (answers: Answers) => questions.filter((question) => question.visible(answers))

type Trigger = { questionIds: string[]; met: (answers: Answers) => boolean; reason: string }

const registrationTriggers: Trigger[] = [
  {
    questionIds: ['public', 'publicEmployeesOnly'],
    met: (answers) => answers.public === 'yes' && answers.publicEmployeesOnly === 'no',
    reason: 'אתם גוף ציבורי והמאגר כולל מידע על אנשים שאינם עובדי הגוף (סעיף 8א(א)(1)(ב)).',
  },
  {
    questionIds: ['broker', 'brokerScale'],
    met: (answers) => answers.broker === 'yes' && answers.brokerScale === 'yes',
    reason:
      'המטרה העיקרית של המאגר היא איסוף מידע אישי לשם מסירתו לאחר, ויש בו מידע על יותר מ-10,000 בני אדם (סעיף 8א(א)(1)(א)).',
  },
]

const officerTriggers: Trigger[] = [
  {
    questionIds: ['public'],
    met: (answers) => answers.public === 'yes',
    reason: 'גוף ציבורי חייב במינוי ממונה, למעט גוף ביטחוני כהגדרתו בסעיף 23כ (סעיף 17ב1(א)(1)).',
  },
  {
    questionIds: ['broker', 'brokerScale'],
    met: (answers) => answers.broker === 'yes' && answers.brokerScale === 'yes',
    reason:
      'מטרת המאגר העיקרית היא מסירת מידע לאחר, ויש בו מידע על יותר מ-10,000 בני אדם (סעיף 17ב1(א)(2)).',
  },
  {
    questionIds: ['monitoring'],
    met: (answers) => answers.monitoring === 'yes',
    reason: 'עיקר העיסוק כרוך בניטור שוטף ושיטתי של אנשים בהיקף ניכר (סעיף 17ב1(א)(3)).',
  },
  {
    questionIds: ['sensitive', 'sensitiveMain'],
    met: (answers) => answers.sensitive === 'yes' && answers.sensitiveMain === 'yes',
    reason: 'עיקר העיסוק כולל עיבוד מידע בעל רגישות מיוחדת בהיקף ניכר (סעיף 17ב1(א)(4)).',
  },
]

const uncertainQuestions = (triggers: Trigger[], answers: Answers) => {
  const ids = new Set<string>()
  for (const trigger of triggers) {
    if (trigger.met(answers)) continue
    const blocked = trigger.questionIds.some((id) => answers[id] === 'no')
    if (blocked) continue
    for (const id of trigger.questionIds) {
      const question = questionById(id)
      if (answers[id] === 'unsure' && question?.visible(answers)) ids.add(id)
    }
  }
  return [...ids]
}

const describeUncertain = (ids: string[]) => ids.map((id) => `לא ידוע: ${questionById(id)?.basis ?? ''}`)

const notInScopeReason = (answers: Answers) =>
  answers.business === 'no'
    ? 'לפי תשובתכם אתם לא מעבדים מידע אישי באמצעים דיגיטליים לצורכי עסק או גוף, ולכן אין לכם מאגר מידע כהגדרתו בחוק.'
    : 'לפי תשובתכם האוסף כולל רק שם, מען ודרכי התקשרות ועומד בתנאי הפטור בהגדרת ״מאגר מידע״, ולכן הוא לא נחשב מאגר מידע.'

function evaluateTriggers(triggers: Trigger[], answers: Answers) {
  const met = triggers.filter((trigger) => trigger.met(answers)).map((trigger) => trigger.reason)
  const uncertain = uncertainQuestions(triggers, answers)
  return { met, uncertain }
}

const nextSteps: Record<DutyId, Record<DutyStatus, string>> = {
  registration: {
    required:
      'מאגר חייב ברישום אסור לעבד מידע בו לפני שהוא נרשם, אלא אם הוגשה בקשה וחלפה התקופה שבחוק בלי סירוב או השהיה (סעיף 8א(א)(2)). פנו לעורך דין או ליועץ פרטיות כדי להגיש את הבקשה לרשות להגנת הפרטיות.',
    check:
      'חסר לכם מידע כדי להכריע. בררו את המספרים ואת מטרת המאגר, ואם עדיין לא ברור, שאלו עורך דין או יועץ פרטיות.',
    notRequired:
      'לפי התשובות אין חובת רישום. תעדו את ההערכה ובדקו אותה מחדש כשמשתנים מטרת המאגר או מספר האנשים בו.',
  },
  notification: {
    required:
      'צריך להודיע לרשות להגנת הפרטיות בתוך 30 ימים מהמועד שבו נחצה הסף: זהות בעל השליטה ודרכי ההתקשרות איתו, זהות הממונה אם נדרש מינויו, והעתק ממסמך הגדרות המאגר (סעיף 8א(ב)). שינוי בפרטים האלה מחייב הודעה נוספת בתוך 30 ימים.',
    check:
      'חסר לכם מידע על מספר האנשים או על סוג המידע. בררו, כי חציית הסף מחייבת הודעה בתוך 30 ימים.',
    notRequired: 'לפי התשובות אין חובת הודעה לפי סעיף 8א(ב). בדקו מחדש אם מספר האנשים במאגר גדל.',
  },
  officer: {
    required:
      'צריך למנות ממונה על הגנת הפרטיות. הממונה יכול להיות גם מי שאינו עובד של הגוף (סעיף 17ב3(ב)), והוא צריך ידע מעמיק בדיני הגנת הפרטיות, הבנה בטכנולוגיה ובאבטחת מידע והיכרות עם תחום הפעילות, בלי ניגוד עניינים (סעיף 17ב3). הוא מדווח ישירות למנהל הכללי או לעובד שכפוף לו ישירות (סעיף 17ב2(ג)).',
    check:
      'חסר לכם מידע כדי להכריע אם העיסוק העיקרי שלכם נכנס להגדרות. שקלו התייעצות עם עורך דין או יועץ פרטיות, כי ההכרעה תלויה בהיקף ובעיקר העיסוק.',
    notRequired:
      'לפי התשובות אין חובת מינוי ממונה. גם בלי חובה אפשר לקבוע אחראי פנימי לפרטיות, ולבדוק מחדש אם העיסוק או ההיקף משתנים.',
  },
}

function buildDuty(
  id: DutyId,
  title: string,
  basis: string,
  triggers: Trigger[],
  answers: Answers,
  scoped: boolean,
): Duty {
  if (!scoped) {
    return { id, title, basis, status: 'notRequired', reasons: [notInScopeReason(answers)], next: nextSteps[id].notRequired }
  }
  const { met, uncertain } = evaluateTriggers(triggers, answers)
  if (met.length) return { id, title, basis, status: 'required', reasons: met, next: nextSteps[id].required }
  if (uncertain.length) {
    return { id, title, basis, status: 'check', reasons: describeUncertain(uncertain), next: nextSteps[id].check }
  }
  return {
    id,
    title,
    basis,
    status: 'notRequired',
    reasons: ['לפי התשובות אף אחת מהעילות שבסעיף לא מתקיימת.'],
    next: nextSteps[id].notRequired,
  }
}

function notificationDuty(answers: Answers, scoped: boolean, registration: Duty): Duty {
  const title = 'הודעה לרשות על מאגר עם מידע רגיש'
  const basis = 'סעיף 8א(ב)'
  if (!scoped) return buildDuty('notification', title, basis, [], answers, false)
  if (registration.status === 'required') {
    return {
      id: 'notification',
      title,
      basis,
      status: 'notRequired',
      reasons: ['ההודעה לפי סעיף 8א(ב) חלה על מאגר שאינו חייב ברישום. המאגר שלכם חייב ברישום, ולכן הכלל הזה לא חל עליו.'],
      next: nextSteps.notification.notRequired,
    }
  }
  const trigger: Trigger = {
    questionIds: ['sensitive', 'sensitiveScale'],
    met: (given) => given.sensitive === 'yes' && given.sensitiveScale === 'yes',
    reason: 'יש במאגר מידע בעל רגישות מיוחדת על יותר מ-100,000 בני אדם (סעיף 8א(ב)).',
  }
  const duty = buildDuty('notification', title, basis, [trigger], answers, true)
  if (duty.status === 'check' && registration.status === 'check') {
    return { ...duty, reasons: [...duty.reasons, 'גם חובת הרישום עדיין לא הוכרעה.'] }
  }
  return duty
}

export function evaluate(answers: Answers): QuizResult {
  const visible = visibleQuestions(answers)
  const answeredCount = visible.filter((question) => answers[question.id] !== undefined).length
  const scoped = inScope(answers)
  const registration = buildDuty(
    'registration',
    'רישום מאגר מידע ברשות להגנת הפרטיות',
    'סעיף 8א(א)',
    registrationTriggers,
    answers,
    scoped,
  )
  const notification = notificationDuty(answers, scoped, registration)
  const officer = buildDuty('officer', 'מינוי ממונה על הגנת הפרטיות', 'סעיף 17ב1(א)', officerTriggers, answers, scoped)
  return {
    duties: [registration, notification, officer],
    visibleCount: visible.length,
    answeredCount,
    complete: answeredCount === visible.length,
    outOfScope: !scoped,
  }
}

export const statusLabel: Record<DutyStatus, string> = {
  required: 'חובה',
  check: 'צריך לבדוק',
  notRequired: 'לא נמצאה חובה',
}

export function resultToText(result: QuizResult): string {
  const lines = ['תוצאת השאלון: רישום מאגר מידע וממונה על הגנת הפרטיות', '']
  for (const duty of result.duties) {
    lines.push(`${duty.title} (${duty.basis}): ${statusLabel[duty.status]}`)
    for (const reason of duty.reasons) lines.push(`- ${reason}`)
    lines.push(duty.next, '')
  }
  lines.push('השאלון הוא כלי עזר כללי ולא ייעוץ משפטי. לבדיקת המקרה שלכם פנו לעורך דין.')
  return lines.join('\n')
}
