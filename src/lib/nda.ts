export type NdaType = 'mutual' | 'oneway'

export type NdaContext = 'business' | 'freelancer' | 'employee'

export type PartyKind = 'company' | 'dealer' | 'person'

export type ScopeMode = 'broad' | 'marked'

export type ReturnMode = 'choice' | 'return' | 'destroy'

export type PartyKey = 'partyA' | 'partyB'

export type NdaParty = {
  kind: PartyKind
  name: string
  idNumber: string
  address: string
  signatory: string
  role: string
}

export type NdaInput = {
  type: NdaType
  context: NdaContext
  partyA: NdaParty
  partyB: NdaParty
  purpose: string
  scope: ScopeMode
  categories: string[]
  noAi: boolean
  noReverse: boolean
  termMonths: string
  years: string
  tradeSecrets: boolean
  returnMode: ReturnMode
  returnDays: string
  liquidated: boolean
  amount: string
  city: string
  date: string
  credit: boolean
}

export type NdaOption = { id: string; label: string; text: string }

export type NdaSignature = { alias: string; name: string; signatory: string; stamp: boolean }

export type NdaBlock =
  | { kind: 'title'; text: string }
  | { kind: 'meta'; text: string }
  | { kind: 'party'; label: string; text: string; alias: string }
  | { kind: 'recital'; text: string }
  | { kind: 'lead'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'clause'; number: string; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'signatures'; lead: string; parties: NdaSignature[] }
  | { kind: 'credit'; text: string; linkText: string; href: string }

export type CheckState = 'ok' | 'missing' | 'optional'

export type NdaCheck = { id: string; label: string; state: CheckState; note: string }

export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/nda-generator'

export const MAX_REASONABLE_YEARS = 7

export const contextOptions: { id: NdaContext; label: string; hint: string }[] = [
  { id: 'business', label: 'בין עסקים', hint: 'שיתוף פעולה, שותף, משקיע או לקוח פוטנציאלי' },
  { id: 'freelancer', label: 'מול פרילנסר או ספק', hint: 'מפתח, מעצב, יועץ או ספק שמקבל גישה למידע' },
  { id: 'employee', label: 'מול עובד', hint: 'סודיות בלבד, בלי סעיף אי תחרות' },
]

export const typeOptions: { id: NdaType; label: string; hint: string }[] = [
  { id: 'mutual', label: 'הדדי', hint: 'שני הצדדים מוסרים מידע ומתחייבים לשמור עליו' },
  { id: 'oneway', label: 'חד-צדדי', hint: 'צד אחד מוסר מידע, והצד השני מתחייב לשמור עליו' },
]

export const partyKinds: { id: PartyKind; label: string; prefix: string }[] = [
  { id: 'company', label: 'חברה (ח.פ.)', prefix: 'ח.פ.' },
  { id: 'dealer', label: 'עוסק מורשה או פטור', prefix: 'מס׳ עוסק' },
  { id: 'person', label: 'אדם פרטי (ת.ז.)', prefix: 'ת.ז.' },
]

export const scopeOptions: { id: ScopeMode; label: string; hint: string }[] = [
  {
    id: 'broad',
    label: 'כל מידע שנמסר בקשר למטרה',
    hint: 'מתאים כשמשתפים הרבה מידע בפגישות, בשיחות ובקבצים',
  },
  {
    id: 'marked',
    label: 'רק מידע שסומן כסודי',
    hint: 'צר וברור יותר, אבל מחייב לסמן כל מסמך ולאשר בכתב מידע שנמסר בעל פה',
  },
]

export const categoryOptions: NdaOption[] = [
  {
    id: 'business',
    label: 'תוכניות עסקיות והצעות מחיר',
    text: 'תוכניות עסקיות, אסטרטגיה, תחזיות, הצעות מחיר ושיטות עבודה פנימיות',
  },
  { id: 'financial', label: 'נתונים כספיים ותמחור', text: 'נתונים כספיים, תמחור, עלויות ורווחיות' },
  {
    id: 'customers',
    label: 'לקוחות וספקים',
    text: 'זהות הלקוחות והספקים, פרטי ההתקשרות איתם ותנאי העסקאות איתם',
  },
  {
    id: 'technical',
    label: 'קוד, טכנולוגיה ואפיון',
    text: 'קוד מקור, אלגוריתמים, ארכיטקטורה, מסמכי אפיון, עיצובים ואבות טיפוס',
  },
  { id: 'data', label: 'מאגרי מידע ומידע אישי', text: 'מאגרי מידע, נתוני משתמשים ומידע אישי על לקוחות' },
  { id: 'ideas', label: 'רעיונות ומוצרים בפיתוח', text: 'רעיונות, המצאות ומוצרים או שירותים שטרם פורסמו' },
]

export const returnOptions: { id: ReturnMode; label: string }[] = [
  { id: 'choice', label: 'להחזיר או להשמיד, לפי בחירת מוסר המידע' },
  { id: 'return', label: 'להחזיר את המידע' },
  { id: 'destroy', label: 'להשמיד את המידע' },
]

const emptyParty = (kind: PartyKind): NdaParty => ({
  kind,
  name: '',
  idNumber: '',
  address: '',
  signatory: '',
  role: '',
})

export const defaultNdaInput = (today: string): NdaInput => ({
  type: 'mutual',
  context: 'business',
  partyA: emptyParty('company'),
  partyB: emptyParty('company'),
  purpose: '',
  scope: 'broad',
  categories: ['business', 'customers', 'technical'],
  noAi: true,
  noReverse: false,
  termMonths: '12',
  years: '3',
  tradeSecrets: true,
  returnMode: 'choice',
  returnDays: '14',
  liquidated: false,
  amount: '',
  city: '',
  date: today,
  credit: true,
})

export const sampleNdaInput = (today: string): NdaInput => ({
  ...defaultNdaInput(today),
  partyA: {
    kind: 'company',
    name: 'חברה לדוגמה בע״מ',
    idNumber: '000000000',
    address: 'רחוב הדוגמה 1, תל אביב-יפו',
    signatory: 'ישראל ישראלי',
    role: 'מנכ״ל',
  },
  partyB: {
    kind: 'company',
    name: 'סטודיו לדוגמה בע״מ',
    idNumber: '000000000',
    address: 'שדרות הניסיון 2, חיפה',
    signatory: 'רות כהן',
    role: 'מנהלת',
  },
  purpose: 'בחינת שיתוף פעולה בפיתוח מערכת לניהול הזמנות',
  noReverse: true,
  city: 'תל אביב-יפו',
})

export const isEmployee = (input: NdaInput) => input.context === 'employee'

export const isMutual = (input: NdaInput) => !isEmployee(input) && input.type === 'mutual'

export const hasLiquidated = (input: NdaInput) => !isEmployee(input) && input.liquidated

const aliases = (input: NdaInput): [string, string] => {
  if (input.context === 'employee') return ['המעסיק', 'העובד']
  if (input.context === 'freelancer') return ['המזמין', 'נותן השירותים']
  return input.type === 'mutual' ? ['צד א׳', 'צד ב׳'] : ['הצד המגלה', 'הצד המקבל']
}

export function partyLabels(input: NdaInput): [string, string] {
  if (input.context === 'employee') return ['המעסיק', 'העובד']
  if (input.context === 'freelancer') return ['המזמין (הלקוח)', 'נותן השירותים']
  return input.type === 'mutual' ? ['צד א׳', 'צד ב׳'] : ['הצד שמוסר את המידע', 'הצד שמקבל את המידע']
}

const partyKindOf = (input: NdaInput, key: PartyKey): PartyKind =>
  isEmployee(input) && key === 'partyB' ? 'person' : input[key].kind

const or = (value: string, fallback: string) => value.trim() || fallback

const clean = (value: string) => value.trim().replace(/[.;,\s]+$/, '')

export const toNumber = (value: string) => {
  const digits = value.replace(/[^\d]/g, '')
  const number = digits ? Number.parseInt(digits, 10) : Number.NaN
  return Number.isFinite(number) && number > 0 ? number : null
}

const yearsText = (value: string) => {
  const number = toNumber(value)
  if (!number) return '[מספר] שנים'
  if (number === 1) return 'שנה אחת'
  if (number === 2) return 'שנתיים'
  return `${number} שנים`
}

const monthsText = (value: string) => {
  const number = toNumber(value)
  if (!number) return '[מספר] חודשים'
  if (number === 1) return 'חודש אחד'
  if (number === 2) return 'חודשיים'
  return `${number} חודשים`
}

const daysText = (value: string) => {
  const number = toNumber(value)
  if (!number) return '[מספר] ימים'
  if (number === 1) return 'יום אחד'
  if (number === 2) return 'יומיים'
  return `${number} ימים`
}

export const formatAmount = (value: string) => {
  const number = toNumber(value)
  return number ? number.toLocaleString('en-US') : '[סכום]'
}

export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split('-')
  return year && month && day ? `${day}.${month}.${year}` : ''
}

const toward = (word: string) => (word.startsWith('ה') ? `ל${word.slice(1)}` : `ל${word}`)

type Clause = { text: string; list?: string[] }
type Section = { id: string; title: string; clauses: Clause[] }

const clause = (text: string): Clause => ({ text })
const listClause = (text: string, list: string[]): Clause => ({ text, list })

type Context = {
  input: NdaInput
  employee: boolean
  mutual: boolean
  freelancer: boolean
  aliasA: string
  aliasB: string
  disc: string
  recv: string
  purposeRef: string
  categories: string[]
}

function partyBlock(input: NdaInput, key: PartyKey, label: string, alias: string): NdaBlock {
  const party = input[key]
  const kind = partyKindOf(input, key)
  const entity = partyKinds.find((item) => item.id === kind) ?? partyKinds[0]
  const parts = [
    or(clean(party.name), `[שם ${alias}]`),
    `${entity.prefix} ${or(party.idNumber, '[מספר]')}`,
    `מען: ${or(clean(party.address), '[כתובת]')}`,
  ]
  if (kind === 'company') {
    const role = clean(party.role)
    parts.push(`באמצעות מורשה החתימה ${or(clean(party.signatory), '[שם מורשה החתימה]')}${role ? `, ${role}` : ''}`)
  }
  return { kind: 'party', label, text: parts.join(', '), alias }
}

function recitals({ input, employee, mutual, freelancer, disc, recv }: Context): string[] {
  const purpose = or(clean(input.purpose), employee ? '[תפקיד העובד]' : '[מטרת שיתוף המידע]')
  if (employee) {
    return [
      `הואיל והעובד מועסק אצל המעסיק, או עומד להיות מועסק אצלו, בתפקיד: ${purpose} (להלן: "העבודה");`,
      'והואיל ובמהלך העבודה יגיע לידיעת העובד מידע סודי של המעסיק;',
      'והואיל והצדדים מבקשים להסדיר בכתב את חובת השמירה על סודיות המידע ואת אופן השימוש בו;',
    ]
  }
  const first = freelancer
    ? `הואיל והמזמין מעוניין לקבל מנותן השירותים שירותים בקשר עם: ${purpose}, או לבחון התקשרות כזו (להלן: "המטרה");`
    : `הואיל והצדדים מעוניינים לנהל ביניהם קשר עסקי לצורך: ${purpose} (להלן: "המטרה");`
  const second = mutual
    ? 'והואיל ולצורך המטרה כל צד עשוי למסור לצד השני מידע סודי;'
    : `והואיל ולצורך המטרה ${disc} עשוי למסור ${toward(recv)} מידע סודי;`
  return [
    first,
    second,
    'והואיל והצדדים מבקשים להסדיר בכתב את חובת השמירה על סודיות המידע ואת אופן השימוש בו;',
  ]
}

function introSection(): Section {
  return {
    id: 'intro',
    title: 'מבוא',
    clauses: [
      clause('המבוא להסכם הוא חלק בלתי נפרד ממנו.'),
      clause('כותרות הסעיפים נועדו לנוחות בלבד, ואין להשתמש בהן לפרשנות ההסכם.'),
    ],
  }
}

function definitionsSection({ input, employee, mutual, disc, recv, purposeRef, categories }: Context): Section {
  const hasList = categories.length > 0
  const definition =
    input.scope === 'marked' && !employee
      ? `"מידע סודי": מידע ש${disc} מסר ${toward(recv)} בקשר עם ${purposeRef}, בכל צורה ובכל אמצעי, ובלבד שסומן כ"סודי" בעת מסירתו, או שנמסר בעל פה או בהדגמה ו${disc} ציין בעת מסירתו שהוא סודי ואישר זאת בכתב, לרבות בדוא״ל, בתוך 14 ימים.${hasList ? ' מידע כזה יכול לכלול, בין השאר:' : ''}`
      : `"מידע סודי": כל מידע, בכל צורה ובכל אמצעי, בין בעל פה, בכתב, בקובץ דיגיטלי, בהדגמה או בדרך אחרת, ש${disc} מסר ${toward(recv)} או שהגיע לידיעת ${recv} בקשר עם ${purposeRef}, ושאדם סביר היה מבין, מטבעו או מנסיבות מסירתו, שהוא סודי${hasList ? ', ובכלל זה:' : '.'}`
  const clauses: Clause[] = [hasList ? listClause(definition, categories) : clause(definition)]
  clauses.push(
    clause(
      `מידע סודי כולל גם ניתוחים, סיכומים, תרשומות ועותקים ש${recv} הכין, שמכילים מידע סודי או מבוססים עליו.`,
    ),
  )
  if (mutual) {
    clauses.push(
      clause(
        '"הצד המגלה": צד שמוסר מידע סודי לפי ההסכם. "הצד המקבל": צד שמקבל מידע סודי לפי ההסכם. כל צד הוא צד מגלה לגבי המידע שהוא מוסר, וצד מקבל לגבי המידע שהוא מקבל.',
      ),
    )
  }
  if (!employee) {
    clauses.push(
      clause(
        `"נציגים": עובדים, מנהלים ויועצים מקצועיים, כמו עורכי דין ורואי חשבון, של ${recv}, וכן קבלני משנה ש${disc} אישר מראש ובכתב, ובלבד שהם זקוקים למידע הסודי לצורך ${purposeRef}.`,
      ),
    )
  }
  return { id: 'definitions', title: 'הגדרות', clauses }
}

function exceptionsSection({ employee, freelancer, disc, recv }: Context): Section {
  const items = [
    'היה נחלת הכלל בעת שנמסר, או הפך לנחלת הכלל לאחר מכן שלא בעקבות הפרה של ההסכם;',
    'היה ידוע לו כדין לפני שנמסר לו, כפי שעולה מרישומים שבידיו;',
    `הגיע אליו כדין מצד שלישי שלא הייתה עליו חובת סודיות כלפי ${disc};`,
  ]
  if (!employee) items.push('פותח על ידו באופן עצמאי, בלי שימוש במידע הסודי;')
  items.push(`${disc} אישר מראש ובכתב את גילויו.`)
  const clauses: Clause[] = [
    listClause(`ההתחייבויות לפי ההסכם לא יחולו על מידע ש${recv} יוכיח כי:`, items),
    clause(
      `נדרש ${recv} לגלות מידע סודי לפי דין, או לפי צו של בית משפט או של רשות מוסמכת, רשאי הוא לגלות את המידע במידה הנדרשת בלבד. ככל שהדין מתיר זאת, יודיע על כך ${toward(disc)} מראש ובהקדם, כדי לאפשר לו לבקש סעד להגנה על המידע.`,
    ),
  ]
  if (employee || freelancer) {
    clauses.push(
      clause(
        `אין בהסכם כדי למנוע מ${recv} להשתמש בידע, בניסיון ובכישורים המקצועיים הכלליים שרכש, ובלבד שלא ישתמש במידע סודי ולא יגלה אותו.`,
      ),
    )
  }
  if (employee) {
    clauses.push(clause('אין בהסכם כדי למנוע מהעובד לפנות לרשות מוסמכת, להגיש תלונה או למסור עדות, לפי דין.'))
  }
  return { id: 'exceptions', title: 'מידע שאינו מידע סודי', clauses }
}

function obligationsSection({ input, employee, disc, recv, purposeRef }: Context): Section {
  const clauses: Clause[] = [
    clause(
      `${recv} ישמור את המידע הסודי בסודיות ולא יגלה אותו לאחר, במישרין או בעקיפין, אלא בהסכמה מראש ובכתב של ${disc} או כמפורט בהסכם.`,
    ),
    clause(
      `${recv} ישתמש במידע הסודי רק לצורך ${purposeRef}, ולא ישתמש בו לכל מטרה אחרת, לטובתו או לטובת אחר.`,
    ),
  ]
  if (!employee) {
    clauses.push(
      clause(
        `${recv} רשאי לגלות מידע סודי לנציגיו במידה שהם זקוקים לו לצורך ${purposeRef}, ובלבד שיידע אותם על סודיות המידע והם מחויבים לשמור עליו בתנאים שאינם מקלים מאלה שבהסכם. ${recv} אחראי כלפי ${disc} להפרה של ההסכם על ידי נציגיו.`,
      ),
      clause(
        `${recv} ינקוט אמצעים סבירים להגנה על המידע הסודי, ולא פחות מהאמצעים שהוא נוקט להגנה על מידע סודי משלו, ובכלל זה יגביל את הגישה אליו וישמור אותו במערכות מאובטחות.`,
      ),
    )
  } else {
    clauses.push(
      clause(
        'העובד ינקוט אמצעים סבירים להגנה על המידע הסודי ויפעל לפי נוהלי אבטחת המידע של המעסיק, כפי שיימסרו לו מעת לעת.',
      ),
    )
  }
  if (input.noAi) {
    clauses.push(
      clause(
        `${recv} לא יזין מידע סודי לכלי בינה מלאכותית או לשירות מקוון של צד שלישי, אלא בכלים ש${disc} אישר בכתב, או בשירות שנדרש לצורך ${purposeRef} ושהספק שלו מחויב לשמור על סודיות המידע ולא להשתמש בו לאימון מודלים.`,
      ),
    )
  }
  clauses.push(
    clause(
      `${recv} לא יעתיק את המידע הסודי ולא ישכפל אותו, אלא במידה הנדרשת לצורך ${purposeRef}. כל עותק הוא מידע סודי לפי ההסכם.`,
    ),
  )
  if (input.noReverse) {
    clauses.push(
      clause(
        `${recv} לא יבצע הנדסה חוזרת, פירוק או ניתוח של מוצר, קוד, תוכנה או אב טיפוס שנמסרו לו, במטרה לגלות את המידע הסודי הגלום בהם.`,
      ),
    )
  }
  if (input.categories.includes('data')) {
    clauses.push(
      clause(
        `מידע אישי שיגיע ${toward(recv)} יעובד רק לצורך ${purposeRef} ובהתאם לחוק הגנת הפרטיות, התשמ״א-1981, והתקנות לפיו.`,
      ),
    )
  }
  clauses.push(
    clause(
      `${recv} יודיע ${toward(disc)} בהקדם על כל גילוי או שימוש במידע סודי שלא לפי ההסכם שנודע לו עליו, ויפעל באופן סביר לצמצום הנזק.`,
    ),
  )
  return { id: 'obligations', title: 'שמירת הסודיות', clauses }
}

function ownershipSection({ employee, disc, recv, purposeRef }: Context): Section {
  const clauses: Clause[] = [
    clause(
      `המידע הסודי הוא ונשאר של ${disc}. אין בהסכם או במסירת המידע כדי להעניק ${toward(recv)} רישיון או זכות כלשהי במידע הסודי או בקניין רוחני של ${disc}, מלבד הזכות להשתמש במידע לצורך ${purposeRef} לפי ההסכם.`,
    ),
  ]
  if (!employee) {
    clauses.push(
      clause(
        `המידע הסודי נמסר כמות שהוא (AS IS). ${disc} אינו מתחייב לדיוק המידע או לשלמותו, אלא אם התחייב לכך בהסכם נפרד בכתב.`,
      ),
      clause(
        'אין בהסכם כדי לחייב צד למסור מידע מסוים או להתקשר בעסקה כלשהי, ואין בו כדי ליצור בין הצדדים שותפות, יחסי עובד ומעביד, סוכנות או מיזם משותף.',
      ),
    )
  }
  return { id: 'ownership', title: 'בעלות במידע', clauses }
}

function termSection({ input, employee }: Context): Section {
  const years = yearsText(input.years)
  const clauses: Clause[] = employee
    ? [
        clause(
          'ההסכם חל לאורך כל תקופת העבודה של העובד אצל המעסיק, ובכלל זה על מידע סודי שהגיע לידיעת העובד לפני חתימת ההסכם.',
        ),
        clause(`חובות הסודיות ואי השימוש לפי ההסכם יעמדו בתוקפן גם במשך ${years} מתום העבודה, מכל סיבה שהיא.`),
      ]
    : [
        clause(
          `ההסכם נכנס לתוקף ביום חתימתו וחל על מידע סודי שנמסר במשך ${monthsText(input.termMonths)} מיום זה (להלן: "תקופת ההסכם"), וכן על מידע סודי שנמסר בקשר עם המטרה לפני חתימתו. כל צד רשאי לסיים את תקופת ההסכם מוקדם יותר בהודעה בכתב לצד השני.`,
        ),
        clause(
          `חובות הסודיות ואי השימוש לפי ההסכם יעמדו בתוקפן במשך ${years} מתום תקופת ההסכם, גם אם ההתקשרות בין הצדדים הסתיימה.`,
        ),
      ]
  if (input.tradeSecrets) {
    clauses.push(
      clause(
        'לגבי מידע סודי שהוא סוד מסחרי כהגדרתו בסעיף 5 לחוק עוולות מסחריות, התשנ״ט-1999, החובות יעמדו בתוקפן כל עוד המידע נשאר סוד מסחרי.',
      ),
    )
  }
  return { id: 'term', title: employee ? 'משך ההתחייבות' : 'תקופת ההסכם ומשך הסודיות', clauses }
}

function returnSection({ input, employee, disc, recv }: Context): Section {
  const days = daysText(input.returnDays)
  if (employee) {
    return {
      id: 'return',
      title: 'החזרת המידע',
      clauses: [
        clause(
          `בסיום העבודה, או קודם לכן לפי דרישת המעסיק, ישיב העובד למעסיק בתוך ${days} את כל המסמכים, הקבצים, הציוד והחומרים שמכילים מידע סודי, ימחק עותקים שנשמרו במכשירים ובחשבונות פרטיים שלו, ויאשר זאת בכתב לבקשת המעסיק.`,
        ),
      ],
    }
  }
  const action =
    input.returnMode === 'return'
      ? `ישיב ${toward(disc)}`
      : input.returnMode === 'destroy'
        ? 'ישמיד'
        : `ישיב ${toward(disc)} או ישמיד, לפי בחירת ${disc},`
  return {
    id: 'return',
    title: input.returnMode === 'destroy' ? 'השמדת המידע' : 'החזרת המידע והשמדתו',
    clauses: [
      clause(
        `בתום תקופת ההסכם, או קודם לכן לפי דרישה בכתב של ${disc}, ${recv} ${action} את כל המידע הסודי שבידיו ובידי נציגיו, כולל עותקים, סיכומים וקבצים דיגיטליים, בתוך ${days}, ויאשר זאת בכתב לבקשת ${disc}.`,
      ),
      clause(
        `על אף האמור, ${recv} רשאי לשמור עותק שהדין מחייב אותו לשמור, ועותקים שנשמרו בגיבוי אוטומטי ושאין דרך סבירה למחוק אותם, ובלבד שלא ייעשה בהם שימוש וחובות הסודיות ימשיכו לחול עליהם.`,
      ),
    ],
  }
}

function remediesSection(
  { input, employee, disc, recv }: Context,
  obligationsNumber: number,
  returnNumber: number,
): Section {
  const forum = employee ? 'מבית הדין לעבודה' : 'מבית המשפט'
  const clauses: Clause[] = [
    clause(
      `הצדדים מכירים בכך שגילוי מידע סודי או שימוש בו בניגוד להסכם עלולים לגרום ${toward(disc)} נזק שקשה לפצות עליו בכסף בלבד. לכן, בנוסף לכל סעד אחר, ${disc} רשאי לבקש ${forum} צו מניעה או צו עשה כדי למנוע הפרה או להפסיק אותה.`,
    ),
  ]
  if (hasLiquidated(input)) {
    clauses.push(
      clause(
        `הפר ${recv} את התחייבויותיו לפי סעיפים ${obligationsNumber} ו-${returnNumber} להסכם, ישלם ${toward(disc)} פיצויים מוסכמים בסך ${formatAmount(input.amount)} ש״ח בשל כל הפרה, בלי צורך בהוכחת נזק, בהתאם לסעיף 15 לחוק החוזים (תרופות בשל הפרת חוזה), התשל״א-1970. הפרות שנעשו במסכת אחת של מעשים ייחשבו הפרה אחת. הצדדים מצהירים שהסכום נקבע כהערכה סבירה מראש של הנזק שעלול להיגרם מהפרה.`,
      ),
      clause(
        `אין בפיצויים המוסכמים כדי לגרוע מזכותו של ${disc} לתבוע במקומם פיצויים בשל הנזק שיוכיח, או כל סעד אחר בשל ההפרה.`,
      ),
    )
  }
  clauses.push(
    clause(
      `אין בהסכם כדי לגרוע מזכות או מסעד של ${disc} לפי כל דין, ובכלל זה לפי חוק עוולות מסחריות, התשנ״ט-1999.`,
    ),
  )
  return { id: 'remedies', title: 'הפרת ההסכם', clauses }
}

function generalSection({ employee }: Context): Section {
  return {
    id: 'general',
    title: 'הוראות כלליות',
    clauses: [
      clause(
        employee
          ? 'הצדדים ינהגו זה כלפי זה בדרך מקובלת ובתום לב בקיום ההסכם, כאמור בסעיף 39 לחוק החוזים (חלק כללי), התשל״ג-1973.'
          : 'הצדדים ינהגו זה כלפי זה בדרך מקובלת ובתום לב, במשא ומתן ביניהם ובקיום ההסכם, כאמור בסעיפים 12 ו-39 לחוק החוזים (חלק כללי), התשל״ג-1973.',
      ),
      clause(
        employee
          ? 'ההסכם בא בנוסף לחוזה העבודה של העובד ואינו גורע ממנו.'
          : 'ההסכם ממצה את ההסכמות בין הצדדים בעניין סודיות המידע הנוגע למטרה, ובא במקום הסכמות קודמות בעניין זה.',
      ),
      clause(
        'שינוי של ההסכם, או ויתור על זכות לפיו, ייעשו בכתב ובחתימת שני הצדדים. הימנעות מהפעלת זכות לא תיחשב ויתור עליה.',
      ),
      clause(
        'אם ייקבע שהוראה בהסכם אינה תקפה או אינה ניתנת לאכיפה, כולה או חלקה, הדבר לא יפגע בתוקף שאר ההוראות.',
      ),
      clause(
        'ההסכם יכול להיחתם בחתימה אלקטרונית ובכמה עותקים, וכל עותק חתום ייחשב מקור. הודעות לפי ההסכם יישלחו לכתובות הצדדים שבמבוא להסכם, או בדוא״ל לכתובת שכל צד יודיע עליה בכתב.',
      ),
    ],
  }
}

function jurisdictionSection({ input, employee }: Context): Section {
  const city = or(clean(input.city), '[עיר]')
  return {
    id: 'jurisdiction',
    title: 'דין וסמכות שיפוט',
    clauses: [
      clause('על ההסכם יחולו דיני מדינת ישראל.'),
      clause(
        employee
          ? `סמכות השיפוט בכל עניין הנוגע להסכם נתונה לבית הדין האזורי לעבודה שבתחום שיפוטו נמצאת העיר ${city}.`
          : `סמכות השיפוט הייחודית בכל עניין הנוגע להסכם נתונה לבתי המשפט המוסמכים ב${city}.`,
      ),
    ],
  }
}

function signature(input: NdaInput, key: PartyKey, alias: string): NdaSignature {
  const party = input[key]
  const company = partyKindOf(input, key) === 'company'
  const role = clean(party.role)
  return {
    alias,
    name: or(clean(party.name), `[שם ${alias}]`),
    signatory: company ? `${or(clean(party.signatory), '[שם מורשה החתימה]')}${role ? `, ${role}` : ''}` : '',
    stamp: company,
  }
}

function buildContext(input: NdaInput): Context {
  const employee = isEmployee(input)
  const mutual = isMutual(input)
  const [aliasA, aliasB] = aliases(input)
  return {
    input,
    employee,
    mutual,
    freelancer: input.context === 'freelancer',
    aliasA,
    aliasB,
    disc: mutual ? 'הצד המגלה' : aliasA,
    recv: mutual ? 'הצד המקבל' : aliasB,
    purposeRef: employee ? 'העבודה' : 'המטרה',
    categories: categoryOptions.filter((option) => input.categories.includes(option.id)).map((option) => option.text),
  }
}

export function ndaTitle(input: NdaInput) {
  if (isEmployee(input)) return 'הסכם סודיות עם עובד'
  return isMutual(input) ? 'הסכם סודיות הדדי' : 'הסכם סודיות'
}

export function buildNda(input: NdaInput): NdaBlock[] {
  const context = buildContext(input)
  const date = formatDate(input.date) || '[תאריך]'
  const blocks: NdaBlock[] = [
    { kind: 'title', text: ndaTitle(input) },
    { kind: 'meta', text: `שנערך ונחתם ביום ${date}` },
    partyBlock(input, 'partyA', 'בין:', context.aliasA),
    partyBlock(input, 'partyB', 'לבין:', context.aliasB),
  ]
  recitals(context).forEach((text) => blocks.push({ kind: 'recital', text }))
  blocks.push({ kind: 'lead', text: 'לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:' })

  const sections: Section[] = [
    introSection(),
    definitionsSection(context),
    exceptionsSection(context),
    obligationsSection(context),
    ownershipSection(context),
    termSection(context),
    returnSection(context),
  ]
  const numberOf = (id: string) => sections.findIndex((section) => section.id === id) + 1
  sections.push(
    remediesSection(context, numberOf('obligations'), numberOf('return')),
    generalSection(context),
    jurisdictionSection(context),
  )

  sections.forEach((section, sectionIndex) => {
    const sectionNumber = sectionIndex + 1
    blocks.push({ kind: 'heading', text: `${sectionNumber}. ${section.title}` })
    section.clauses.forEach((item, clauseIndex) => {
      blocks.push({ kind: 'clause', number: `${sectionNumber}.${clauseIndex + 1}`, text: item.text })
      if (item.list?.length) blocks.push({ kind: 'list', items: item.list })
    })
  })

  blocks.push({
    kind: 'signatures',
    lead: 'ולראיה באו הצדדים על החתום:',
    parties: [signature(input, 'partyA', context.aliasA), signature(input, 'partyB', context.aliasB)],
  })

  if (input.credit) {
    blocks.push({
      kind: 'credit',
      text: 'ההסכם נוצר באמצעות',
      linkText: 'מחולל הסכם הסודיות של AITERRA',
      href: GENERATOR_URL,
    })
  }

  return blocks
}

export function ndaChecks(input: NdaInput): NdaCheck[] {
  const filled = (...values: string[]) => values.every((value) => value.trim())
  const employee = isEmployee(input)
  const [labelA, labelB] = partyLabels(input)
  const partyCheck = (key: PartyKey, label: string): NdaCheck => {
    const party = input[key]
    const company = partyKindOf(input, key) === 'company'
    const complete = filled(party.name, party.idNumber, party.address) && (!company || filled(party.signatory))
    return {
      id: key,
      label: `פרטי ${label}`,
      state: complete ? 'ok' : 'missing',
      note: company ? 'שם, ח.פ., מען ומורשה חתימה' : 'שם, מספר מזהה ומען',
    }
  }
  const checks: NdaCheck[] = [
    partyCheck('partyA', labelA),
    partyCheck('partyB', labelB),
    {
      id: 'purpose',
      label: employee ? 'תפקיד העובד' : 'מטרת שיתוף המידע',
      state: filled(input.purpose) ? 'ok' : 'missing',
      note: 'קובעת לאיזה צורך מותר להשתמש במידע',
    },
  ]
  if (!employee) {
    checks.push({
      id: 'term',
      label: 'תקופת ההסכם',
      state: toNumber(input.termMonths) ? 'ok' : 'missing',
      note: 'כמה זמן ממשיכים למסור מידע במסגרת ההסכם',
    })
  }
  checks.push(
    {
      id: 'years',
      label: 'משך הסודיות',
      state: toNumber(input.years) ? 'ok' : 'missing',
      note: 'כמה זמן החובה נמשכת אחרי הסיום',
    },
    {
      id: 'city',
      label: 'עיר לסמכות השיפוט',
      state: filled(input.city) ? 'ok' : 'missing',
      note: employee ? 'לפי האזור של בית הדין לעבודה' : 'איפה יתבררו מחלוקות',
    },
    {
      id: 'date',
      label: 'תאריך החתימה',
      state: formatDate(input.date) ? 'ok' : 'missing',
      note: employee ? 'מתי ההסכם נחתם' : 'ממנו נמדדת תקופת ההסכם',
    },
  )
  if (!employee) {
    checks.push({
      id: 'amount',
      label: 'פיצוי מוסכם',
      state: input.liquidated ? (toNumber(input.amount) ? 'ok' : 'missing') : 'optional',
      note: input.liquidated ? 'סכום שיש לו יחס סביר לנזק הצפוי' : 'לא חובה',
    })
  }
  return checks
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const SIGN_LINE = '____________________'

const signatureLines = (party: NdaSignature) => {
  const lines = [`${party.alias}: ${party.name}`]
  if (party.signatory) lines.push(`באמצעות: ${party.signatory}`)
  lines.push(`${party.stamp ? 'חתימה וחותמת' : 'חתימה'}: ${SIGN_LINE}`, `תאריך: ${SIGN_LINE}`)
  return lines
}

export function ndaToHtml(blocks: NdaBlock[]): string {
  const body = blocks
    .map((block) => {
      if (block.kind === 'title') return `<h1>${escapeHtml(block.text)}</h1>`
      if (block.kind === 'meta' || block.kind === 'recital' || block.kind === 'lead') {
        return `<p>${escapeHtml(block.text)}</p>`
      }
      if (block.kind === 'party') {
        return `<p><strong>${escapeHtml(block.label)}</strong> ${escapeHtml(block.text)} (להלן: &quot;${escapeHtml(block.alias)}&quot;)</p>`
      }
      if (block.kind === 'heading') return `<h2>${escapeHtml(block.text)}</h2>`
      if (block.kind === 'clause') return `<p>${escapeHtml(block.number)} ${escapeHtml(block.text)}</p>`
      if (block.kind === 'list') {
        return `<ul>\n${block.items.map((item) => `  <li>${escapeHtml(item)}</li>`).join('\n')}\n</ul>`
      }
      if (block.kind === 'signatures') {
        const cells = block.parties
          .map(
            (party) =>
              `<td style="width:50%;vertical-align:top;padding:16px 12px 0">${signatureLines(party)
                .map((line) => `<p>${escapeHtml(line)}</p>`)
                .join('')}</td>`,
          )
          .join('')
        return `<p>${escapeHtml(block.lead)}</p>\n<table style="width:100%;border-collapse:collapse"><tr>${cells}</tr></table>`
      }
      return `<p>${escapeHtml(block.text)} <a href="${block.href}">${escapeHtml(block.linkText)}</a></p>`
    })
    .join('\n')
  return `<section dir="rtl" lang="he">\n${body}\n</section>`
}

export function ndaToText(blocks: NdaBlock[]): string {
  return blocks
    .map((block) => {
      if (block.kind === 'title' || block.kind === 'meta' || block.kind === 'recital' || block.kind === 'lead') {
        return block.text
      }
      if (block.kind === 'party') return `${block.label} ${block.text} (להלן: "${block.alias}")`
      if (block.kind === 'heading') return `\n${block.text}`
      if (block.kind === 'clause') return `${block.number} ${block.text}`
      if (block.kind === 'list') return block.items.map((item) => `• ${item}`).join('\n')
      if (block.kind === 'signatures') {
        return `\n${block.lead}\n\n${block.parties.map((party) => signatureLines(party).join('\n')).join('\n\n')}`
      }
      return `\n${block.text} ${block.linkText}: ${block.href}`
    })
    .join('\n')
    .trim()
}

export function ndaDocument(blocks: NdaBlock[], title: string): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>body{max-width:760px;margin:40px auto;padding:0 20px;font:16px/1.7 Arial,Helvetica,sans-serif;color:#1a1f33}h1{font-size:26px;text-align:center;margin-bottom:4px}h1+p{text-align:center;color:#4a5068}h2{font-size:18px;margin:26px 0 6px}p{margin:0 0 8px}ul{margin:0 0 10px}td p{margin:0 0 14px}a{color:#2447d6}@media print{body{margin:0 auto}h2{break-after:avoid}table{break-inside:avoid}}</style>
</head>
<body>
${ndaToHtml(blocks)}
</body>
</html>
`
}
