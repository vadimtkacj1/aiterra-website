export type RankGroup = 'enlisted' | 'nco' | 'officer'

export type IdfRank = {
  id: string
  name: string
  abbreviation: string
  group: RankGroup
  english: string
  nato: string
  insignia: string
  worn: string
}

export const IDF_RANKS_REVIEWED = '2026-10-23'
export const IDF_RANKS_REVIEWED_LABEL = '23.10.2026'

export const groupLabels: Record<RankGroup, string> = {
  enlisted: 'חוגרים',
  nco: 'נגדים',
  officer: 'קצינים',
}

export const groupNotes: Record<RankGroup, string> = {
  enlisted: 'דרגות החובה. סימן הדרגה תפור על שרוול החולצה, בין המרפק לכתף.',
  nco: 'אנשי קבע שלא עברו קורס קצינים. סימן הדרגה ענוד על כותפת החולצה.',
  officer: 'בוגרי קורס קצינים וקורסים מקבילים. סימן הדרגה ענוד על כותפת החולצה.',
}

const ARM = 'על השרוול'
const SHOULDER = 'על הכותפת'

export const idfRanks: IdfRank[] = [
  { id: 'turai', name: 'טוראי', abbreviation: 'טור׳', group: 'enlisted', english: 'Private', nato: '', insignia: 'ללא סימן', worn: '' },
  { id: 'rav-turai', name: 'רב־טוראי', abbreviation: 'רב״ט', group: 'enlisted', english: 'Corporal', nato: '', insignia: 'שני פסים', worn: ARM },
  { id: 'samal', name: 'סמל', abbreviation: 'סמל', group: 'enlisted', english: 'Sergeant', nato: '', insignia: 'שלושה פסים', worn: ARM },
  { id: 'samar', name: 'סמל ראשון', abbreviation: 'סמ״ר', group: 'enlisted', english: 'Staff Sergeant', nato: '', insignia: 'שלושה פסים ועלה גפן', worn: ARM },
  { id: 'rasal', name: 'רב־סמל', abbreviation: 'רס״ל', group: 'nco', english: 'Sergeant First Class', nato: '', insignia: 'שברון אחד', worn: SHOULDER },
  { id: 'rasar', name: 'רב־סמל ראשון', abbreviation: 'רס״ר', group: 'nco', english: 'Master Sergeant', nato: '', insignia: 'שני שברונים', worn: SHOULDER },
  { id: 'rasam', name: 'רב־סמל מתקדם', abbreviation: 'רס״ם', group: 'nco', english: 'Sergeant Major', nato: '', insignia: 'שברון אחד ומגן דוד', worn: SHOULDER },
  { id: 'rasab', name: 'רב־סמל בכיר', abbreviation: 'רס״ב', group: 'nco', english: 'Warrant Officer', nato: '', insignia: 'שני שברונים ומגן דוד', worn: SHOULDER },
  { id: 'ranag', name: 'רב־נגד', abbreviation: 'רנ״ג', group: 'nco', english: 'Chief Warrant Officer', nato: '', insignia: 'שלושה שברונים ומגן דוד', worn: SHOULDER },
  { id: 'segen-mishne', name: 'סגן־משנה', abbreviation: 'סג״ם', group: 'officer', english: 'Second Lieutenant', nato: 'OF-1', insignia: 'ענף זית אחד', worn: SHOULDER },
  { id: 'segen', name: 'סגן', abbreviation: 'סגן', group: 'officer', english: 'Lieutenant', nato: 'OF-1', insignia: 'שני ענפי זית', worn: SHOULDER },
  { id: 'seren', name: 'סרן', abbreviation: 'סרן', group: 'officer', english: 'Captain', nato: 'OF-2', insignia: 'שלושה ענפי זית', worn: SHOULDER },
  { id: 'rav-seren', name: 'רב־סרן', abbreviation: 'רס״ן', group: 'officer', english: 'Major', nato: 'OF-3', insignia: 'עלה גפן אחד', worn: SHOULDER },
  { id: 'sgan-aluf', name: 'סגן־אלוף', abbreviation: 'סא״ל', group: 'officer', english: 'Lieutenant Colonel', nato: 'OF-4', insignia: 'שני עלי גפן', worn: SHOULDER },
  { id: 'aluf-mishne', name: 'אלוף־משנה', abbreviation: 'אל״ם', group: 'officer', english: 'Colonel', nato: 'OF-5', insignia: 'שלושה עלי גפן', worn: SHOULDER },
  { id: 'tat-aluf', name: 'תת־אלוף', abbreviation: 'תא״ל', group: 'officer', english: 'Brigadier General', nato: 'OF-6', insignia: 'חרב וענף זית מוצלבים', worn: SHOULDER },
  { id: 'aluf', name: 'אלוף', abbreviation: 'אלוף', group: 'officer', english: 'Major General', nato: 'OF-7', insignia: 'חרב וענף זית מוצלבים ועלה גפן', worn: SHOULDER },
  { id: 'rav-aluf', name: 'רב־אלוף', abbreviation: 'רב״ל', group: 'officer', english: 'Lieutenant General', nato: 'OF-8', insignia: 'חרב וענף זית מוצלבים ושני עלי גפן', worn: SHOULDER },
]

export const rankLevel = (id: string) => idfRanks.findIndex((rank) => rank.id === id)

const normalize = (value: string) =>
  value
    .replace(/[֑-ׇ]/g, '')
    .replace(/[׳״־"'\-\s]/g, '')
    .toLowerCase()

export function filterRanks(query: string, group: RankGroup | 'all'): IdfRank[] {
  const needle = normalize(query)
  return idfRanks.filter((rank) => {
    if (group !== 'all' && rank.group !== group) return false
    if (!needle) return true
    return [rank.name, rank.abbreviation, rank.english].some((text) => normalize(text).includes(needle))
  })
}

export function compareRanks(firstId: string, secondId: string): 'first' | 'second' | 'same' {
  const first = rankLevel(firstId)
  const second = rankLevel(secondId)
  if (first === second) return 'same'
  return first > second ? 'first' : 'second'
}
