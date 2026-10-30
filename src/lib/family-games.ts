import { shuffled, type SheetSection } from './print-sheet'

export type EventKind = 'shabbat-hatan' | 'shabbat-kala' | 'sheva-brachot' | 'bar-mitzvah' | 'bat-mitzvah' | 'birthday'
export type Gender = 'male' | 'female'

export const EVENT_KINDS: { id: EventKind; label: string; couple: boolean; shabbat: boolean }[] = [
  { id: 'shabbat-hatan', label: 'שבת חתן', couple: true, shabbat: true },
  { id: 'shabbat-kala', label: 'שבת כלה', couple: true, shabbat: true },
  { id: 'sheva-brachot', label: 'שבע ברכות', couple: true, shabbat: false },
  { id: 'bar-mitzvah', label: 'בר מצווה', couple: false, shabbat: false },
  { id: 'bat-mitzvah', label: 'בת מצווה', couple: false, shabbat: false },
  { id: 'birthday', label: 'יום הולדת', couple: false, shabbat: false },
]

const ROUND_SIZE = 10

const WHO = [
  'מי קם ראשון בבוקר?',
  'מי מאחר יותר?',
  'מי מבשל טוב יותר?',
  'מי מדבר יותר בטלפון?',
  'מי זוכר תאריכים חשובים?',
  'מי מחפש את המפתחות כל הזמן?',
  'מי נוהג בנסיעות ארוכות?',
  'מי יותר מסודר?',
  'מי מתעקש להיות צודק?',
  'מי מתקשר ראשון להורים?',
  'מי מתרגש מהר יותר?',
  'מי מזמין אורחים בלי להודיע?',
  'מי אוהב מתוק יותר?',
  'מי בודק מחירים לפני קנייה?',
  'מי מתכנן את החופשות?',
  'מי נשאר ער עד מאוחר?',
  'מי מתקן דברים בבית?',
  'מי מספר את הבדיחות?',
]

const COUPLE_QUIZ = [
  'איפה {a} ו{b} נפגשו בפעם הראשונה?',
  'מי אמר ראשון שזה זה?',
  'מה המאכל האהוב על {a}?',
  'מה המאכל האהוב על {b}?',
  'מה התחביב של {a}?',
  'מה התחביב של {b}?',
  'מה הצבע האהוב על {b}?',
  'איזה שיר מזכיר לכם את {a} ו{b}?',
  'כמה זמן {a} ו{b} מכירים?',
  'לאן הם יסעו בטיול הראשון אחרי החתונה?',
  'מה הכינוי של {a} בילדות?',
  'מה הכינוי של {b} בילדות?',
  'מה {a} הכי מעריך ב{b}?',
  'מה {b} הכי מעריכה ב{a}?',
]

const SOLO_QUIZ = (male: boolean) => [
  'מה המאכל האהוב על {a}?',
  'מה התחביב של {a}?',
  'מה הצבע האהוב על {a}?',
  `מי ${male ? 'החבר הכי טוב' : 'החברה הכי טובה'} של {a}?`,
  `איזה מקצוע {a} ${male ? 'אוהב' : 'אוהבת'} בבית הספר?`,
  `מה הסרט או הסדרה ש{a} ${male ? 'אוהב' : 'אוהבת'}?`,
  'לאן {a} רוצה לטייל?',
  `מה {a} רוצה להיות ${male ? 'כשיהיה גדול' : 'כשתהיה גדולה'}?`,
  'מה הכינוי של {a} בבית?',
  `באיזו שעה {a} ${male ? 'קם' : 'קמה'} בשבת?`,
  'מה הדבר ש{a} עושה הכי טוב?',
  `באיזו עיר {a} ${male ? 'נולד' : 'נולדה'}?`,
]

const ORAL_ROUNDS = [
  'שתי אמיתות ושקר: כל אורח מספר שלושה דברים על עצמו, ושאר השולחן מנחש מה לא נכון.',
  'סיפור בשרשרת: כל אחד מוסיף משפט אחד לסיפור על בעלי השמחה.',
  'זיכרון בדקה: כל אורח מספר זיכרון קצר ונעים.',
  'ברכה במילה: כל אחד אומר מילה אחת שמתארת את בעלי השמחה, והאחרון מחבר ברכה מכולן.',
]

const PEOPLE_BINGO = [
  'נולד באותו חודש כמו בעל השמחה',
  'יודע לשיר את השיר האהוב על המשפחה',
  'ביקר ביותר מחמש מדינות',
  'מדבר יותר משתי שפות',
  'מכיר את בעל השמחה יותר מעשר שנים',
  'יש לו יותר משלושה אחים',
  'יודע לבשל מאכל משפחתי',
  'נסע הכי רחוק כדי להגיע',
  'יודע להגיד ברכה בשפה אחרת',
  'גר באותה עיר כמו בעל השמחה',
]

const BLESSING_WORDS: Record<string, string> = {
  א: 'אהבה', ב: 'ברכה', ג: 'גאווה', ד: 'דרך טובה', ה: 'הצלחה', ו: 'ודאות', ז: 'זכות', ח: 'חיוך', ט: 'טוב לב', י: 'יופי',
  כ: 'כבוד', ל: 'לב רחב', מ: 'מזל טוב', נ: 'נחת', ס: 'סיפוק', ע: 'עושר', פ: 'פרנסה', צ: 'צחוק', ק: 'קדושה', ר: 'רוגע',
  ש: 'שמחה', ת: 'תקווה',
}

const FINAL_LETTERS: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' }

export function nameAcrostic(name: string) {
  return [...name.replace(/[^א-ת]/g, '')].map((letter) => {
    const base = FINAL_LETTERS[letter] ?? letter
    return `${letter}: ${BLESSING_WORDS[base]}`
  })
}

const fill = (text: string, a: string, b: string) => text.replaceAll('{a}', a).replaceAll('{b}', b)

export type GameInput = { kind: EventKind; first: string; second: string; gender: Gender; shabbat: boolean; seed: number }

export function buildGames({ kind, first, second, gender, shabbat, seed }: GameInput): SheetSection[] {
  const event = EVENT_KINDS.find((item) => item.id === kind) ?? EVENT_KINDS[0]
  const a = first.trim() || (event.couple ? 'החתן' : 'בעל השמחה')
  const b = second.trim() || 'הכלה'
  const honoree = event.couple ? `${a} ו${b}` : a
  const male = kind === 'bar-mitzvah' || (kind === 'birthday' && gender === 'male')
  const quiz = event.couple ? COUPLE_QUIZ : SOLO_QUIZ(male)
  const sections: SheetSection[] = []

  if (event.couple) {
    sections.push({
      title: `${a} או ${b}?`,
      note: 'קוראים שאלה, והאורחים מצביעים בהרמת יד. בעלי השמחה עונים אחרונים.',
      items: shuffled(WHO, seed).slice(0, ROUND_SIZE),
    })
  }
  sections.push({
    title: `כמה אתם מכירים את ${honoree}?`,
    note: shabbat ? 'שואלים בעל פה, ובני המשפחה מאשרים את התשובה.' : 'האורחים רושמים תשובות, ומי שצדק הכי הרבה זוכה.',
    items: shuffled(quiz, seed + 1).slice(0, ROUND_SIZE).map((item) => fill(item, a, b)),
  })
  sections.push({
    title: `ברכה לפי אותיות השם ${a}`,
    note: 'קוראים יחד, וכל אורח מוסיף משפט לאות שלו.',
    items: nameAcrostic(a),
  })
  if (event.couple) {
    sections.push({ title: `ברכה לפי אותיות השם ${b}`, items: nameAcrostic(b) })
  }
  sections.push({ title: 'סבב לשולחן', items: shuffled(ORAL_ROUNDS, seed + 2) })
  if (!shabbat) {
    sections.push({
      title: 'בינגו אורחים: מצאו מישהו ש...',
      note: 'כל אורח מחפש אורחים שמתאימים ורושם את שמם. הראשון שמסיים זוכה.',
      items: shuffled(PEOPLE_BINGO, seed + 3),
    })
  }
  return sections.filter((section) => section.items.length > 0)
}
