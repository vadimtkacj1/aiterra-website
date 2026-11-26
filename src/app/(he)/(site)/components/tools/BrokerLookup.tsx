'use client'

import { failureText } from '@/lib/company-lookup'
import { BROKER_RESULTS_LIMIT, LICENSE_MAX_DIGITS, LICENSE_MIN_DIGITS } from '@/lib/broker-registry'
import BrokerLookupView, { type BrokerCopy } from './BrokerLookupView'

const copy: BrokerCopy = {
  sectionLabel: 'בדיקת רישיון תיווך ברשימת המתווכים המורשים',
  legend: 'המתווך',
  fieldLabel: 'שם המתווך או מספר רישיון',
  fieldHint: 'השם בעברית, בכל סדר. את מספר הרישיון מבקשים מהמתווך.',
  submit: 'חיפוש',
  emptyError: 'הקלידו שם של מתווך או מספר רישיון.',
  invalidError: (problem, digits) => {
    if (problem === 'digits') {
      return `מספר רישיון תיווך הוא ${LICENSE_MIN_DIGITS} עד ${LICENSE_MAX_DIGITS} ספרות. הקלדתם ${digits} ספרות.`
    }
    if (problem === 'latin') return 'השמות במאגר רשומים בעברית. הקלידו את השם בעברית, או חפשו לפי מספר הרישיון.'
    return 'הקלידו לפחות 2 אותיות משם המתווך, או את מספר הרישיון.'
  },
  resultTitle: 'התוצאה',
  idle: 'הקלידו שם או מספר רישיון ולחצו על חיפוש. נראה אם המתווך מופיע ברשימת המתווכים המורשים שמשרד המשפטים מפרסם.',
  searching: 'מחפש ברשימת המתווכים המורשים',
  slow: 'המאגר הממשלתי עונה לאט כרגע. ממתינים עד 15 שניות.',
  retry: 'ניסיון נוסף',
  failure: {
    ...failureText,
    format: 'המאגר החזיר תשובה שלא הצלחנו לקרוא. נסו שוב, ואם זה חוזר, חפשו בפנקס המתווכים ב-gov.il.',
  },
  badge: 'מופיע ברשימת המתווכים המורשים',
  licenseLabel: 'מספר רישיון',
  source: (dataDate) =>
    `מקור: רשימת המתווכים המורשים של משרד המשפטים ב-data.gov.il${dataDate ? `, הקובץ עודכן ב-${dataDate}` : ''}.`,
  compare: 'השוו את השם ואת מספר הרישיון לפרטים שהמתווך מסר לכם. שם זהה עם מספר אחר הוא מתווך אחר.',
  registerLink: 'פנקס המתווכים הרשמי ב-gov.il',
  choose: 'בחרו מתווך מהרשימה. כשיש כמה מתווכים באותו שם, מזהים לפי מספר הרישיון.',
  listLabel: (count, more) =>
    more
      ? `יש יותר מ-${BROKER_RESULTS_LIMIT} מתווכים כאלה, ומוצגים ${BROKER_RESULTS_LIMIT} מהם. הוסיפו את השם הפרטי או חפשו לפי מספר רישיון.`
      : `נמצאו ${count} מתווכים`,
  showing: (name) => `מוצגים הפרטים של ${name}`,
  announce: (brokers, more) => {
    if (!brokers.length) return 'לא נמצא מתווך ברשימה'
    if (brokers.length === 1) return `נמצא מתווך ברשימה: ${brokers[0].name}`
    return more ? `נמצאו יותר מ-${BROKER_RESULTS_LIMIT} מתווכים` : `נמצאו ${brokers.length} מתווכים`
  },
  notFoundName: {
    title: 'לא נמצא מתווך בשם הזה ברשימה',
    tips: [
      'נסו רק את שם המשפחה.',
      'הרשימה כוללת אנשים ולא משרדי תיווך. חפשו את שם המתווך עצמו ולא את שם המשרד או הרשת.',
      'בקשו מהמתווך את מספר הרישיון שלו וחפשו לפיו.',
    ],
  },
  notFoundLicense: {
    title: 'לא נמצא ברשימה מתווך עם מספר הרישיון',
    tips: ['בדקו את הספרות מול תעודת הרישיון של המתווך.'],
    registerTip: {
      before: 'הרשימה הפתוחה מתעדכנת מדי פעם, ולכן בודקים גם ב',
      link: 'פנקס המתווכים ב-gov.il',
      after: ' לפני שמסיקים שאין רישיון.',
    },
  },
  privacy:
    'החיפוש עובר ישירות מהדפדפן שלכם למאגר הפתוח של משרד המשפטים ב-data.gov.il. אנחנו לא שומרים את מה שחיפשתם.',
}

export default function BrokerLookup() {
  return <BrokerLookupView copy={copy} />
}
