import { idfRanks } from '@/lib/idf-ranks'

export type PoliceGroup = 'constable' | 'nco' | 'officer'

export type PoliceRank = {
  id: string
  name: string
  abbreviation: string
  group: PoliceGroup
  english: string
  idfId: string
  role: string
  worn: string
}

export const POLICE_RANKS_REVIEWED = '2026-10-24'
export const POLICE_RANKS_REVIEWED_LABEL = '24.10.2026'

export const groupLabels: Record<PoliceGroup, string> = {
  constable: 'שוטרים',
  nco: 'נגדים',
  officer: 'קצינים',
}

export const groupNotes: Record<PoliceGroup, string> = {
  constable: 'משוטר עד רב־סמל. סימן הדרגה ענוד על צווארון החולצה.',
  nco: 'מרב־סמל ראשון עד רב־נגד. סימן הדרגה ענוד על כותפות החולצה, הסוודר או המעיל.',
  officer: 'ממפקח־משנה עד רב־ניצב. סימן הדרגה ענוד על כותפות. צוער בקורס קצינים אינו נחשב קצין עדיין.',
}

const COLLAR = 'על הצווארון'
const SHOULDER = 'על הכותפת'

export const policeRanks: PoliceRank[] = [
  { id: 'shoter', name: 'שוטר', abbreviation: 'שוטר', group: 'constable', english: 'Constable', idfId: 'turai', role: 'דרגת הפתיחה של מי שמתגייס למשטרה', worn: COLLAR },
  { id: 'rav-shoter', name: 'רב־שוטר', abbreviation: 'רש״ט', group: 'constable', english: 'Corporal', idfId: 'rav-turai', role: '', worn: COLLAR },
  { id: 'samal-sheni', name: 'סמל שני', abbreviation: 'סמ״ש', group: 'constable', english: 'Sergeant', idfId: 'samal', role: '', worn: COLLAR },
  { id: 'samal-rishon', name: 'סמל ראשון', abbreviation: 'סמ״ר', group: 'constable', english: 'Staff Sergeant', idfId: 'samar', role: '', worn: COLLAR },
  { id: 'rav-samal', name: 'רב־סמל', abbreviation: 'רס״ל', group: 'constable', english: 'Sergeant Major', idfId: 'rasal', role: '', worn: COLLAR },
  { id: 'rasar', name: 'רב־סמל ראשון', abbreviation: 'רס״ר', group: 'nco', english: 'Staff Sergeant Major', idfId: 'rasar', role: '', worn: SHOULDER },
  { id: 'rasam', name: 'רב־סמל מתקדם', abbreviation: 'רס״ם', group: 'nco', english: 'Advanced Staff Sergeant Major', idfId: 'rasam', role: '', worn: SHOULDER },
  { id: 'rasab', name: 'רב־סמל בכיר', abbreviation: 'רס״ב', group: 'nco', english: 'Senior Staff Sergeant Major', idfId: 'rasab', role: '', worn: SHOULDER },
  { id: 'ranag', name: 'רב־נגד', abbreviation: 'רנ״ג', group: 'nco', english: 'Senior Non-Commissioned Officer', idfId: 'ranag', role: '', worn: SHOULDER },
  { id: 'mefakeach-mishne', name: 'מפקח־משנה', abbreviation: 'ממ״ש', group: 'officer', english: 'Sub-Inspector', idfId: 'segen-mishne', role: 'דרגת הקצונה הראשונה אחרי קורס קצינים', worn: SHOULDER },
  { id: 'mefakeach', name: 'מפקח', abbreviation: 'מפקח', group: 'officer', english: 'Inspector', idfId: 'segen', role: 'קצין סיור, חקירות או מודיעין בתחנה ובמרחב; מפקד מחלקה או צוות במשמר הגבול', worn: SHOULDER },
  { id: 'pakad', name: 'פקד', abbreviation: 'פקד', group: 'officer', english: 'Chief Inspector', idfId: 'seren', role: 'ראש משרד בתחנה (חקירות, מודיעין ובילוש, שיטור וקהילה); סגן מפקד פלוגה במשמר הגבול', worn: SHOULDER },
  { id: 'rav-pakad', name: 'רב־פקד', abbreviation: 'רפ״ק', group: 'officer', english: 'Superintendent', idfId: 'rav-seren', role: 'סגן מפקד תחנה, ראש לשכה במרחב; מפקד פלוגה או יחידה במשמר הגבול', worn: SHOULDER },
  { id: 'sgan-nitzav', name: 'סגן־ניצב', abbreviation: 'סנ״צ', group: 'officer', english: 'Chief Superintendent', idfId: 'sgan-aluf', role: 'מפקד תחנה, סגן מפקד מרחב, ראש ענף במחוז, ראש מדור במטה הארצי', worn: SHOULDER },
  { id: 'nitzav-mishne', name: 'ניצב־משנה', abbreviation: 'נצ״מ', group: 'officer', english: 'Commander', idfId: 'aluf-mishne', role: 'מפקד מרחב או מפקד ימ״ר מחוזי, ראש מחלקה במטה הארצי', worn: SHOULDER },
  { id: 'tat-nitzav', name: 'תת־ניצב', abbreviation: 'תנ״צ', group: 'officer', english: 'Brigadier General', idfId: 'tat-aluf', role: 'סגן מפקד מחוז, ראש חטיבה במטה הארצי, מפקד יחידה ארצית כמו יאח״ה', worn: SHOULDER },
  { id: 'nitzav', name: 'ניצב', abbreviation: 'ניצב', group: 'officer', english: 'Major General', idfId: 'aluf', role: 'מפקד מחוז, ראש אגף במטה הארצי, מפקד משמר הגבול, סגן המפכ״ל', worn: SHOULDER },
  { id: 'rav-nitzav', name: 'רב־ניצב', abbreviation: 'רנ״צ', group: 'officer', english: 'Inspector General', idfId: 'rav-aluf', role: 'המפקח הכללי של משטרת ישראל (המפכ״ל)', worn: SHOULDER },
]

export const policeGroupOrder: PoliceGroup[] = ['constable', 'nco', 'officer']

export const idfNameOf = (id: string) => idfRanks.find((rank) => rank.id === id)?.name ?? ''

export const policeLevel = (id: string) => policeRanks.findIndex((rank) => rank.id === id)

const normalize = (value: string) =>
  value
    .replace(/[֑-ׇ]/g, '')
    .replace(/[׳״־"'\-\s]/g, '')
    .toLowerCase()

export function filterPoliceRanks(query: string, group: PoliceGroup | 'all'): PoliceRank[] {
  const needle = normalize(query)
  return policeRanks.filter((rank) => {
    if (group !== 'all' && rank.group !== group) return false
    if (!needle) return true
    return [rank.name, rank.abbreviation, rank.english, idfNameOf(rank.idfId)].some((text) =>
      normalize(text).includes(needle),
    )
  })
}

export function policeForIdf(idfId: string): PoliceRank | undefined {
  return policeRanks.find((rank) => rank.idfId === idfId)
}

export type ServiceRank = { name: string; abbreviation: string; idfId: string; role: string }

export const prisonRanks: ServiceRank[] = [
  { name: 'סוהר', abbreviation: '', idfId: 'turai', role: '' },
  { name: 'רב־סוהר', abbreviation: 'ר״ס', idfId: 'rav-turai', role: '' },
  { name: 'סמל', abbreviation: '', idfId: 'samal', role: '' },
  { name: 'סמל ראשון', abbreviation: 'סמ״ר', idfId: 'samar', role: '' },
  { name: 'רב־סמל', abbreviation: 'רס״ל', idfId: 'rasal', role: '' },
  { name: 'רב־סמל ראשון', abbreviation: 'רס״ר', idfId: 'rasar', role: '' },
  { name: 'רב־סמל מתקדם', abbreviation: 'רס״ם', idfId: 'rasam', role: '' },
  { name: 'רב־סמל בכיר', abbreviation: 'רס״ב', idfId: 'rasab', role: '' },
  { name: 'רב־נגד', abbreviation: 'רנ״ג', idfId: 'ranag', role: '' },
  { name: 'מישר־משנה', abbreviation: 'ממ״ן', idfId: 'segen-mishne', role: 'עוזר מפקד אגף' },
  { name: 'מישר', abbreviation: '', idfId: 'segen', role: 'מנהל אגף, סגן מפקד משמרת' },
  { name: 'כלאי', abbreviation: '', idfId: 'seren', role: 'מנהל אגף, סגן מפקד משמרת, מפקד צוות ביחידה מחוזית' },
  { name: 'רב־כלאי', abbreviation: 'ר״כ', idfId: 'rav-seren', role: 'מפקד משמרת או אגף, קצין מודיעין, קצין אסירים' },
  { name: 'סגן גונדר', abbreviation: 'סג״ד', idfId: 'sgan-aluf', role: 'ראש ענף, סגן מפקד בבית סוהר, מפקד בית מעצר' },
  { name: 'גונדר־משנה', abbreviation: 'גנ״מ', idfId: 'aluf-mishne', role: 'מפקד בית סוהר, ראש מחלקה בנציבות' },
  { name: 'תת־גונדר', abbreviation: 'תג״ד', idfId: 'tat-aluf', role: '' },
  { name: 'גונדר', abbreviation: '', idfId: 'aluf', role: '' },
  { name: 'רב־גונדר', abbreviation: '', idfId: 'rav-aluf', role: 'נציב בתי הסוהר' },
]

export const fireRanks: ServiceRank[] = [
  { name: 'לוחם אש', abbreviation: '', idfId: 'turai', role: '' },
  { name: 'כבאי ראשון', abbreviation: '', idfId: 'rav-turai', role: '' },
  { name: 'רב־כבאי', abbreviation: 'רב״כ', idfId: 'samal', role: '' },
  { name: 'סמל כבאי', abbreviation: '', idfId: 'samar', role: '' },
  { name: 'רב־סמל כבאי', abbreviation: 'רס״ל', idfId: 'rasal', role: '' },
  { name: 'רב־סמל ראשון כבאי', abbreviation: 'רס״ר', idfId: 'rasar', role: '' },
  { name: 'רב־סמל בכיר כבאי', abbreviation: 'רס״ב', idfId: 'rasab', role: '' },
  { name: 'רב־נגד', abbreviation: 'רנ״ג', idfId: 'ranag', role: '' },
  { name: 'להב־משנה', abbreviation: '', idfId: 'segen-mishne', role: 'סגן מפקד משמרת; במטה קצין משל״ט או מניעת דליקות' },
  { name: 'להב', abbreviation: '', idfId: 'segen', role: 'סגן מפקד משמרת; במטה קצין משל״ט או מניעת דליקות' },
  { name: 'רשף', abbreviation: '', idfId: 'seren', role: 'סגן מפקד משמרת; במטה סגן מפקד משל״ט' },
  { name: 'רב־רשף', abbreviation: '', idfId: 'rav-seren', role: 'מפקד משמרת; במטה מפקד משל״ט או ראש מדור' },
  { name: 'סגן טפסר', abbreviation: '', idfId: 'sgan-aluf', role: 'סגן מפקד תחנה אזורית; במטה ראש ענף' },
  { name: 'טפסר־משנה', abbreviation: '', idfId: 'aluf-mishne', role: 'מפקד תחנה אזורית; במטה ראש אגף' },
  { name: 'תת־טפסר', abbreviation: '', idfId: 'tat-aluf', role: 'סגן מפקד מחוז' },
  { name: 'טפסר', abbreviation: '', idfId: 'aluf', role: 'מפקד מחוז, סגן נציב כבאות והצלה' },
  { name: 'רב־טפסר', abbreviation: '', idfId: 'rav-aluf', role: 'נציב כבאות והצלה לישראל' },
]
