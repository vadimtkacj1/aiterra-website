import { femaleNames, lookup, maleNames, type NameEntry } from './name-transliteration'

const DEMANDED_NAMES = [
  'כהן', 'משה', 'שי', 'יצחק', 'יוסף', 'עידו', 'יעקב', 'אליהו', 'דניאל', 'מיכאל', 'אריאל', 'יפעת', 'יונתן',
  'איתמר', 'חיים', 'יוסי', 'יהונתן', 'מאיר', 'אברהם', 'דוד', 'אורי', 'יובל', 'יאיר', 'יעל', 'פרץ', 'אלירן',
  'נעמה', 'בנימין', 'גבריאל', 'שירן', 'אלי', 'אסתר', 'הראל', 'מאור', 'מיטל', 'מירב', 'מרים', 'שמואל', 'שרה',
  'גיא', 'אלה', 'בן', 'חן', 'יואב', 'מרדכי', 'עדי', 'מיכל', 'שירה', 'זהבה', 'שמעון', 'שלמה', 'תהל', 'אזולאי',
  'אביה', 'אילנה', 'אילת', 'חנה', 'מוריה', 'נועה', 'נטלי',
]

export type NamePage = { slug: string; entry: NameEntry; gender: 'male' | 'female' | 'surname' | 'both' }

export const NAME_PAGES_BASE = '/tools/name-in-english'

export const namePagePath = (slug: string) => `${NAME_PAGES_BASE}/${slug}`

const genderOf = (hebrew: string): NamePage['gender'] => {
  const male = maleNames.some((entry) => entry.hebrew === hebrew)
  const female = femaleNames.some((entry) => entry.hebrew === hebrew)
  if (male && female) return 'both'
  if (male) return 'male'
  if (female) return 'female'
  return 'surname'
}

const slugOf = (spelling: string) =>
  spelling
    .toLowerCase()
    .replace(/[^a-z]+/g, '-')
    .replace(/^-|-$/g, '')

function buildPages(): NamePage[] {
  const used = new Set<string>()
  const pages: NamePage[] = []
  for (const hebrew of DEMANDED_NAMES) {
    const entry = lookup(hebrew)
    if (!entry) continue
    let slug = slugOf(entry.spellings[0])
    if (used.has(slug)) slug = `${slug}-${entry.kind}`
    if (!slug || used.has(slug)) continue
    used.add(slug)
    pages.push({ slug, entry, gender: genderOf(entry.hebrew) })
  }
  return pages
}

export const namePages = buildPages()

export const namePageBySlug = (slug: string) => namePages.find((page) => page.slug === slug)
