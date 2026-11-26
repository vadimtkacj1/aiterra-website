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
  how?: string
  roles?: string
  history?: string
}

export const IDF_RANKS_REVIEWED = '2026-10-23'
export const IDF_RANKS_REVIEWED_LABEL = '23.10.2026'
export const IDF_RANKS_WIKI_URL = 'https://he.wikipedia.org/wiki/%D7%93%D7%A8%D7%92%D7%95%D7%AA_%D7%A6%D7%91%D7%90_%D7%94%D7%94%D7%92%D7%A0%D7%94_%D7%9C%D7%99%D7%A9%D7%A8%D7%90%D7%9C'
export const IDF_RANK_FACTS_CHECKED = '26.11.2026'

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
  { id: 'turai', name: 'טוראי', abbreviation: 'טור׳', group: 'enlisted', english: 'Private', nato: '', insignia: 'ללא סימן', worn: '', how: 'כל חייל וחיילת מקבלים אותה ביום הגיוס.' },
  { id: 'rav-turai', name: 'רב־טוראי', abbreviation: 'רב״ט', group: 'enlisted', english: 'Corporal', nato: '', insignia: 'שני פסים', worn: ARM, how: 'בתפקיד עורפי מקבלים אותה 10 חודשים אחרי הגיוס, תומכי לחימה אחרי 8 חודשים, ולוחמים בסיום ההכשרה. בוגרי חלק מקורסי ההדרכה והפיקוד מקבלים אותה כבר בסוף הקורס, חודשיים עד שלושה אחרי הגיוס.', history: 'לוחמי זרוע היבשה נוהגים לא לענוד את סימן הרב״ט על המדים.' },
  { id: 'samal', name: 'סמל', abbreviation: 'סמל', group: 'enlisted', english: 'Sergeant', nato: '', insignia: 'שלושה פסים', worn: ARM, how: 'לוחמים מקבלים אותה שנה וארבעה חודשים אחרי הגיוס, תומכי לחימה אחרי שנה וחצי, ובתפקיד עורפי אחרי שנה ושמונה חודשים. בוגר קורס מפקדים מקבל אותה בסיום הקורס. ברוב המקרים צריך לעבור גם ״מבחן סמל״.', history: 'זו דרגת הפיקוד הנמוכה בצה״ל, והשם שלה הוא ראשי תיבות של ״סגן מחוץ למניין״.' },
  { id: 'samar', name: 'סמל ראשון', abbreviation: 'סמ״ר', group: 'enlisted', english: 'Staff Sergeant', nato: '', insignia: 'שלושה פסים ועלה גפן', worn: ARM, how: 'בדרך כלל כשנה אחרי דרגת סמל. לוחמים זכאים לה שנתיים אחרי הגיוס, ובתפקיד פיקודי אחרי שנה ועשרה חודשים.', history: 'השם הוא ראשי תיבות של ״סגן מחוץ למניין ראשון״.' },
  { id: 'rasal', name: 'רב־סמל', abbreviation: 'רס״ל', group: 'nco', english: 'Sergeant First Class', nato: '', insignia: 'שברון אחד', worn: SHOULDER, how: 'זו דרגת הנגד הראשונה, של אנשי קבע. מי שסיים שירות סדיר כסמ״ר ממשיך להתקדם בשירות המילואים ויכול להגיע לדרגה הזאת גם בלי לחתום קבע. אנשי מילואים שאינם קצינים נוהגים לא לענוד את סימן הדרגה.' },
  { id: 'rasar', name: 'רב־סמל ראשון', abbreviation: 'רס״ר', group: 'nco', english: 'Master Sergeant', nato: '', insignia: 'שני שברונים', worn: SHOULDER, how: 'מי שסיים שירות סדיר כסמ״ר ממשיך להתקדם בשירות המילואים ויכול להגיע לדרגה הזאת גם בלי לחתום קבע. אנשי מילואים שאינם קצינים נוהגים לא לענוד את סימן הדרגה.', history: 'מ-1958 ענדו רס״רים ליד סימן הדרגה כוכב ותק על כל חמש שנים בדרגה.' },
  { id: 'rasam', name: 'רב־סמל מתקדם', abbreviation: 'רס״ם', group: 'nco', english: 'Sergeant Major', nato: '', insignia: 'שברון אחד ומגן דוד', worn: SHOULDER, how: 'ניתנת לכל המאוחר שבע שנים אחרי קבלת דרגת רס״ר. מי שסיים שירות סדיר כסמ״ר ממשיך להתקדם בשירות המילואים ויכול להגיע לדרגה הזאת גם בלי לחתום קבע. אנשי מילואים שאינם קצינים נוהגים לא לענוד את סימן הדרגה.', history: 'הדרגה נוספה לסולם ב-1987.' },
  { id: 'rasab', name: 'רב־סמל בכיר', abbreviation: 'רס״ב', group: 'nco', english: 'Warrant Officer', nato: '', insignia: 'שני שברונים ומגן דוד', worn: SHOULDER, how: 'מי שסיים שירות סדיר כסמ״ר ממשיך להתקדם בשירות המילואים ויכול להגיע לדרגה הזאת גם בלי לחתום קבע. אנשי מילואים שאינם קצינים נוהגים לא לענוד את סימן הדרגה.', history: 'הדרגה נוספה לסולם ב-1977.' },
  { id: 'ranag', name: 'רב־נגד', abbreviation: 'רנ״ג', group: 'nco', english: 'Chief Warrant Officer', nato: '', insignia: 'שלושה שברונים ומגן דוד', worn: SHOULDER, history: 'נוספה ב-1993, והיא דרגת הנגד הגבוהה בצה״ל. ב-2011 אושרה מתחתיה דרגת רב־נגד משנה, אבל לא נעשה בה שימוש.' },
  { id: 'segen-mishne', name: 'סגן־משנה', abbreviation: 'סג״ם', group: 'officer', english: 'Second Lieutenant', nato: 'OF-1', insignia: 'ענף זית אחד', worn: SHOULDER, how: 'מקבלים אותה בסיום קורס קצינים וההשלמה החילית.', roles: 'מפקד מחלקה (מ״מ)' },
  { id: 'segen', name: 'סגן', abbreviation: 'סגן', group: 'officer', english: 'Lieutenant', nato: 'OF-1', insignia: 'שני ענפי זית', worn: SHOULDER, how: 'שנה אחרי דרגת סג״ם, או מיד עם הכניסה לשירות קבע, המוקדם מבין השניים.', roles: 'סגן מפקד פלוגה (סמ״פ)' },
  { id: 'seren', name: 'סרן', abbreviation: 'סרן', group: 'officer', english: 'Captain', nato: 'OF-2', insignia: 'שלושה ענפי זית', worn: SHOULDER, how: 'עד ארבע שנים אחרי דרגת סגן, עם מינוי לתפקיד של סרן.', roles: 'מפקד פלוגה (מ״פ), מפקד סוללה במערך ההגנה האווירית' },
  { id: 'rav-seren', name: 'רב־סרן', abbreviation: 'רס״ן', group: 'officer', english: 'Major', nato: 'OF-3', insignia: 'עלה גפן אחד', worn: SHOULDER, how: 'עד חמש שנים אחרי דרגת סרן, עם מינוי לתפקיד של רס״ן.', roles: 'סגן מפקד גדוד (סמג״ד), סגן מפקד טייסת' },
  { id: 'sgan-aluf', name: 'סגן־אלוף', abbreviation: 'סא״ל', group: 'officer', english: 'Lieutenant Colonel', nato: 'OF-4', insignia: 'שני עלי גפן', worn: SHOULDER, how: 'בהחלטת קצין בדרגת אלוף ובאישור הרמטכ״ל או ראש אכ״א, עד שש שנים אחרי דרגת רס״ן, ובהתחייבות לשירות של חמש שנים לפחות.', roles: 'מפקד גדוד (מג״ד), סגן מפקד חטיבה (סמח״ט)' },
  { id: 'aluf-mishne', name: 'אלוף־משנה', abbreviation: 'אל״ם', group: 'officer', english: 'Colonel', nato: 'OF-5', insignia: 'שלושה עלי גפן', worn: SHOULDER, how: 'בהחלטת הרמטכ״ל ובאישור שר הביטחון.', roles: 'מפקד חטיבה (מח״ט), סגן מפקד אוגדה, מפקד כנף בחיל האוויר, מפקד שייטת בחיל הים', history: 'הדרגה נוספה בינואר 1950, למפקדי חטיבות. עד אז אלוף הייתה הדרגה המקבילה לקולונל.' },
  { id: 'tat-aluf', name: 'תת־אלוף', abbreviation: 'תא״ל', group: 'officer', english: 'Brigadier General', nato: 'OF-6', insignia: 'חרב וענף זית מוצלבים', worn: SHOULDER, how: 'בהחלטת הרמטכ״ל ובאישור שר הביטחון.', roles: 'מפקד חיל, מפקד אוגדה (מאו״ג), ראש מטה של פיקוד מרחבי, מפקד בסיס של חיל האוויר' },
  { id: 'aluf', name: 'אלוף', abbreviation: 'אלוף', group: 'officer', english: 'Major General', nato: 'OF-7', insignia: 'חרב וענף זית מוצלבים ועלה גפן', worn: SHOULDER, history: 'עד ינואר 1950 אלוף הייתה הדרגה המקבילה לקולונל. כשנוספה מתחתיה דרגת אלוף־משנה, אלוף עלתה לרמה של גנרל.' },
  { id: 'rav-aluf', name: 'רב־אלוף', abbreviation: 'רא״ל', group: 'officer', english: 'Lieutenant General', nato: 'OF-8', insignia: 'חרב וענף זית מוצלבים ושני עלי גפן', worn: SHOULDER, how: 'מקבל אותה רק מי שמתמנה לרמטכ״ל.', history: 'ב-1954 נקבע שרב־אלוף צמודה לרמטכ״ל בזמן הכהונה, ושבסיומה הוא יורד לדרגת אלוף. הנוהל בוטל ב-1960.' },
]

export const rankLevel = (id: string) => idfRanks.findIndex((rank) => rank.id === id)

export const idfRankPath = (id: string) => `/tools/idf-ranks/${id}`

export const idfRankById = (id: string) => idfRanks.find((rank) => rank.id === id)

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
