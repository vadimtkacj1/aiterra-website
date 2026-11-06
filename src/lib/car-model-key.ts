const MULTI_WORD_BRANDS = ['ב מ וו', 'בי ווי די', 'לינק אנד קו', "קיי ג'י", 'אלפא רומיאו', 'מרוטי סוזוקי']
const BRAND_ALIASES: Record<string, string> = { 'מרוטי סוזוקי': 'סוזוקי' }
const PAIRED_FAMILIES = new Set(['MAZDA', 'LEXUS', 'MODEL', 'TIGGO', 'ATTO', 'JAECOO', 'LAND', 'RAV', 'SPACE', 'IONIQ'])
const PAIRED_WORDS: Record<string, string> = { Y: 'Y', X: 'X', S: 'S', STAR: 'STAR', CRUISER: 'CRUISER', CRISER: 'CRUISER' }

export function brandKeyOf(manufacturer: string) {
  const name = manufacturer.trim().replace(/\s+/g, ' ')
  const multi = MULTI_WORD_BRANDS.find((prefix) => name.startsWith(prefix))
  if (multi) return BRAND_ALIASES[multi] ?? multi
  return name.split(/[\s-]+/)[0] ?? ''
}

export function familyKeyOf(commercialName: string) {
  const words = commercialName
    .toUpperCase()
    .replace(/^(MAZDA|JAECOO|TIGGO|ATTO)(\d)/, '$1 $2')
    .split(/\s+/)
    .filter(Boolean)
  const [first, second] = words
  if (!first) return ''
  if (second === 'CROSS') return `${first} CROSS`
  if (PAIRED_FAMILIES.has(first) && second) {
    if (/^\d{1,2}$/.test(second)) return `${first} ${second}`
    if (PAIRED_WORDS[second]) return `${first} ${PAIRED_WORDS[second]}`
  }
  return first
}

export function carModelKey(manufacturer: string, commercialName: string, year: number | null) {
  return `${brandKeyOf(manufacturer)}|${familyKeyOf(commercialName)}|${year ?? ''}`
}
