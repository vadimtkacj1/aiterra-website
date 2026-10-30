export type CalcField = { id: string; label: string; example: number }
export type CalcLine = { label: string; value: number; kind: 'money' | 'number' | 'percent' | 'months' }
export type CalcVerdict = { good: boolean; text: string }
export type CalcResult = { main: CalcLine; lines: CalcLine[]; verdict: CalcVerdict }
type Values = Record<string, number>

export type BusinessCalculator = {
  slug: string
  title: string
  metaTitle: string
  description: string
  lede: string
  formula: string
  fields: CalcField[]
  compute: (values: Values) => CalcResult | null
  faq: { question: string; answer: string }[]
}

const money = (label: string, value: number): CalcLine => ({ label, value, kind: 'money' })
const months = (label: string, value: number): CalcLine => ({ label, value, kind: 'months' })
const percent = (label: string, value: number): CalcLine => ({ label, value, kind: 'percent' })
const number = (label: string, value: number): CalcLine => ({ label, value, kind: 'number' })

export const businessCalculators: BusinessCalculator[] = [
  {
    slug: 'business-payback',
    title: 'מחשבון החזר השקעה בעסק',
    metaTitle: 'מחשבון החזר השקעה: תוך כמה זמן העסק יחזיר את עצמו',
    description: 'מכניסים השקעה, הכנסות והוצאות חודשיות ורואים תוך כמה חודשים העסק מחזיר את ההשקעה ומה ה-ROI השנתי.',
    lede: 'כדי לדעת אם עסק משתלם, מחלקים את ההשקעה ברווח החודשי ומקבלים את מספר החודשים להחזר.',
    formula: 'חודשי החזר = השקעה ÷ (הכנסות חודשיות − הוצאות חודשיות).',
    fields: [
      { id: 'investment', label: 'השקעה ראשונית (₪)', example: 100000 },
      { id: 'revenue', label: 'הכנסות בחודש (₪)', example: 40000 },
      { id: 'costs', label: 'הוצאות בחודש (₪)', example: 30000 },
    ],
    compute: ({ investment, revenue, costs }) => {
      const profit = revenue - costs
      if (investment <= 0) return null
      if (profit <= 0)
        return {
          main: money('הפסד בחודש', -profit),
          lines: [],
          verdict: { good: false, text: 'בנתונים האלה העסק לא מחזיר את ההשקעה, כי ההוצאות גבוהות מההכנסות או שוות להן.' },
        }
      const payback = investment / profit
      return {
        main: months('החזר ההשקעה', payback),
        lines: [money('רווח בחודש', profit), percent('ROI שנתי', ((profit * 12) / investment) * 100)],
        verdict:
          payback <= 24
            ? { good: true, text: 'החזר בתוך שנתיים. לרוב העסקים הקטנים זה קצב טוב, אם התחזית מציאותית.' }
            : { good: false, text: 'החזר ארוך משנתיים. כדאי לבדוק איך להעלות מחיר, להוריד עלויות או להקטין את ההשקעה.' },
      }
    },
    faq: [
      { question: 'מה נחשב החזר השקעה טוב?', answer: 'אין מספר אחד. עסק קטן שואף בדרך כלל להחזר בתוך שנתיים עד שלוש, אבל זה תלוי בענף ובסיכון.' },
      { question: 'האם לכלול את השכר של הבעלים?', answer: 'כן. אם לא כוללים אותו בהוצאות, הרווח נראה גבוה מהמציאות.' },
    ],
  },
  {
    slug: 'break-even',
    title: 'מחשבון נקודת איזון',
    metaTitle: 'מחשבון נקודת איזון: כמה צריך למכור כדי לא להפסיד',
    description: 'מכניסים הוצאות קבועות, מחיר ועלות ליחידה ורואים כמה יחידות ואיזה מחזור צריך כדי לכסות את ההוצאות.',
    lede: 'נקודת האיזון היא כמות המכירות שבה ההכנסות מכסות בדיוק את כל ההוצאות.',
    formula: 'נקודת איזון = הוצאות קבועות ÷ (מחיר ליחידה − עלות משתנה ליחידה).',
    fields: [
      { id: 'fixed', label: 'הוצאות קבועות בחודש (₪)', example: 20000 },
      { id: 'price', label: 'מחיר מכירה ליחידה (₪)', example: 100 },
      { id: 'unitCost', label: 'עלות משתנה ליחידה (₪)', example: 40 },
    ],
    compute: ({ fixed, price, unitCost }) => {
      const margin = price - unitCost
      if (price <= 0) return null
      if (margin <= 0)
        return { main: money('הפסד על כל יחידה', -margin), lines: [], verdict: { good: false, text: 'כל מכירה מפסידה כסף, ולכן אין נקודת איזון בלי לשנות מחיר או עלות.' } }
      const units = Math.ceil(fixed / margin)
      return {
        main: number('יחידות בחודש', units),
        lines: [money('מחזור נדרש', units * price), number('יחידות ביום (30 יום)', Math.ceil(units / 30)), percent('תרומה ליחידה', (margin / price) * 100)],
        verdict: { good: true, text: 'בדקו אם הכמות הזו ריאלית מול הביקוש והיכולת שלכם. כל יחידה מעבר לה מייצרת רווח.' },
      }
    },
    faq: [
      { question: 'מה ההבדל בין עלות קבועה למשתנה?', answer: 'עלות קבועה, כמו שכירות, לא תלויה בכמות המכירות. עלות משתנה, כמו חומרי גלם, גדלה עם כל מכירה.' },
      { question: 'מה עושים אם נקודת האיזון גבוהה מדי?', answer: 'מעלים מחיר, מורידים עלות ליחידה או מקטינים הוצאות קבועות.' },
    ],
  },
  {
    slug: 'business-viability',
    title: 'מחשבון כדאיות עסק',
    metaTitle: 'מחשבון כדאיות עסק: האם הרעיון ישתלם לכם',
    description: 'מכניסים לקוחות, מחיר, עלויות ושכר רצוי ובודקים אם העסק משאיר מספיק כסף ביד.',
    lede: 'עסק כדאי כשהוא מכסה את כל ההוצאות ומשאיר לכם לפחות את השכר שאתם צריכים.',
    formula: 'רווח = לקוחות × (מחיר − עלות ללקוח) − הוצאות קבועות.',
    fields: [
      { id: 'customers', label: 'לקוחות בחודש', example: 100 },
      { id: 'price', label: 'הכנסה מלקוח (₪)', example: 300 },
      { id: 'unitCost', label: 'עלות ללקוח (₪)', example: 100 },
      { id: 'fixed', label: 'הוצאות קבועות בחודש (₪)', example: 8000 },
      { id: 'salary', label: 'שכר רצוי לעצמכם בחודש (₪)', example: 12000 },
    ],
    compute: ({ customers, price, unitCost, fixed, salary }) => {
      const margin = price - unitCost
      if (price <= 0) return null
      const profit = customers * margin - fixed
      const needed = margin > 0 ? Math.ceil((fixed + salary) / margin) : 0
      return {
        main: money('רווח לפני מס בחודש', profit),
        lines: margin > 0 ? [number('לקוחות נדרשים לשכר הרצוי', needed), money('פער מול השכר הרצוי', profit - salary)] : [],
        verdict:
          profit >= salary
            ? { good: true, text: 'לפי הנתונים העסק מכסה את ההוצאות ואת השכר הרצוי, לפני מס.' }
            : { good: false, text: 'לפי הנתונים העסק לא מגיע לשכר הרצוי. שנו מחיר, עלויות או מספר לקוחות ובדקו שוב.' },
      }
    },
    faq: [
      { question: 'איך מעריכים מספר לקוחות?', answer: 'התחילו מהערכה זהירה: בדקו מתחרים, ביקוש בחיפוש ומכירות ניסיון לפני השקעה גדולה.' },
      { question: 'האם התוצאה לפני מס?', answer: 'כן. את המס אפשר להעריך במחשבון המס לעצמאים.' },
    ],
  },
  {
    slug: 'ad-roas',
    title: 'מחשבון ROAS ורווח מפרסום',
    metaTitle: 'מחשבון ROAS: האם הפרסום באמת מרוויח',
    description: 'מכניסים תקציב, מכירות ורווחיות ובודקים ROAS, ROAS מינימלי ורווח אמיתי מהקמפיין.',
    lede: 'ROAS גבוה לא מבטיח רווח. צריך להשוות אותו ל-ROAS המינימלי לפי שיעור הרווח שלכם.',
    formula: 'ROAS = הכנסות ÷ תקציב. ROAS מינימלי = 100 ÷ שיעור רווח גולמי.',
    fields: [
      { id: 'spend', label: 'תקציב פרסום (₪)', example: 5000 },
      { id: 'revenue', label: 'הכנסות מהקמפיין (₪)', example: 20000 },
      { id: 'margin', label: 'רווח גולמי (%)', example: 40 },
    ],
    compute: ({ spend, revenue, margin }) => {
      if (spend <= 0 || margin <= 0) return null
      const profit = (revenue * margin) / 100 - spend
      const minimum = 100 / margin
      return {
        main: number('ROAS', revenue / spend),
        lines: [number('ROAS מינימלי', minimum), money('רווח אחרי פרסום', profit)],
        verdict: profit >= 0 ? { good: true, text: 'הקמפיין מכסה את עצמו לפי הרווח הגולמי.' } : { good: false, text: 'הקמפיין מפסיד כסף גם אם ההכנסות נראות גבוהות.' },
      }
    },
    faq: [{ question: 'מה נחשב ROAS טוב?', answer: 'ROAS טוב הוא כזה שגבוה מה-ROAS המינימלי של העסק. בשיעור רווח של 25% המינימום הוא 4.' }],
  },
  {
    slug: 'customer-ltv-cac',
    title: 'מחשבון LTV ו-CAC',
    metaTitle: 'מחשבון LTV ו-CAC: כמה מותר לשלם על לקוח',
    description: 'מחשבים ערך לקוח לאורך זמן, עלות גיוס ויחס LTV ל-CAC כדי לדעת אם השיווק משתלם.',
    lede: 'אם לקוח מרוויח לכם יותר ממה שעלה לגייס אותו, אפשר להגדיל את השיווק.',
    formula: 'LTV = רווח מלקוח בחודש × חודשי שימור. CAC = תקציב שיווק ÷ לקוחות חדשים.',
    fields: [
      { id: 'monthlyProfit', label: 'רווח מלקוח בחודש (₪)', example: 200 },
      { id: 'retention', label: 'חודשים שלקוח נשאר', example: 12 },
      { id: 'marketing', label: 'תקציב שיווק בחודש (₪)', example: 10000 },
      { id: 'newCustomers', label: 'לקוחות חדשים בחודש', example: 10 },
    ],
    compute: ({ monthlyProfit, retention, marketing, newCustomers }) => {
      if (newCustomers <= 0 || marketing <= 0) return null
      const ltv = monthlyProfit * retention
      const cac = marketing / newCustomers
      const ratio = ltv / cac
      return {
        main: number('יחס LTV ל-CAC', ratio),
        lines: [money('LTV', ltv), money('CAC', cac)],
        verdict: ratio >= 3 ? { good: true, text: 'יחס של 3 ומעלה נחשב בריא ברוב העסקים.' } : { good: false, text: 'היחס נמוך מ-3. כדאי להוזיל גיוס או להאריך את שימור הלקוחות.' },
      }
    },
    faq: [{ question: 'למה יחס של 3?', answer: 'זה כלל אצבע נפוץ: הוא משאיר מרווח להוצאות אחרות ולרווח. הוא לא מתאים לכל ענף.' }],
  },
  {
    slug: 'cash-runway',
    title: 'מחשבון Runway',
    metaTitle: 'מחשבון Runway: לכמה חודשים יספיק הכסף בעסק',
    description: 'מכניסים יתרה, הכנסות והוצאות ורואים לכמה חודשים יספיק המזומן בקצב הנוכחי.',
    lede: 'Runway הוא מספר החודשים שהעסק יכול להמשיך לפעול בקצב השריפה הנוכחי.',
    formula: 'Runway = יתרת מזומן ÷ (הוצאות חודשיות − הכנסות חודשיות).',
    fields: [
      { id: 'cash', label: 'יתרת מזומן (₪)', example: 150000 },
      { id: 'revenue', label: 'הכנסות בחודש (₪)', example: 30000 },
      { id: 'costs', label: 'הוצאות בחודש (₪)', example: 45000 },
    ],
    compute: ({ cash, revenue, costs }) => {
      const burn = costs - revenue
      if (burn <= 0) return { main: money('עודף בחודש', -burn), lines: [], verdict: { good: true, text: 'ההכנסות מכסות את ההוצאות, ולכן המזומן לא נשחק.' } }
      const runway = cash / burn
      return {
        main: months('המזומן יספיק ל', runway),
        lines: [money('שריפה בחודש', burn)],
        verdict: runway >= 6 ? { good: true, text: 'יש לכם כחצי שנה ומעלה לפעול, בהנחה שהקצב לא ישתנה.' } : { good: false, text: 'פחות מחצי שנה. כדאי לפעול עכשיו על הכנסות, הוצאות או מימון.' },
      }
    },
    faq: [{ question: 'כמה Runway צריך?', answer: 'כלל אצבע נפוץ הוא לפחות 6 חודשים, כדי שיהיה זמן לתקן לפני שהכסף נגמר.' }],
  },
]

export const businessCalculatorBySlug = (slug: string) => businessCalculators.find((item) => item.slug === slug)
export const businessCalculatorPath = (slug: string) => `/tools/business/${slug}`
