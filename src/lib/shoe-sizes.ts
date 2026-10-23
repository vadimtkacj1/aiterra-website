export const SHOES_CHECKED = '2026-10-23'
export const SHOES_CHECKED_LABEL = '23.10.2026'

export type ShoeGroupId = 'men' | 'women' | 'kids'

export type ShoeSize = {
  eu: number
  us: string
  uk: number
  foot: number
  usAlt?: string
}

export type ShoeSourceId = 'nikeMen' | 'nikeWomen' | 'nikeKids' | 'iso9407' | 'hugoBoss' | 'wikipedia'

export const shoeSources: Record<ShoeSourceId, { label: string; href: string; official: boolean }> = {
  nikeMen: {
    label: 'Nike: Men’s Footwear Size Chart',
    href: 'https://www.nike.com/size-fit/mens-footwear',
    official: true,
  },
  nikeWomen: {
    label: 'Nike: Women’s Shoes Size Chart',
    href: 'https://www.nike.com/size-fit/womens-footwear',
    official: true,
  },
  nikeKids: {
    label: 'Nike: Kids’ Shoes Size Chart',
    href: 'https://www.nike.com/size-fit/kids-footwear',
    official: true,
  },
  iso9407: {
    label: 'ISO 9407:2019: Footwear sizing, Mondopoint system of sizing and marking',
    href: 'https://www.iso.org/standard/71594.html',
    official: true,
  },
  hugoBoss: {
    label: 'HUGO BOSS: Menswear Shoes size chart (רשימת המדינות שמשתמשות במידות אירופאיות, כולל ישראל)',
    href: 'https://www.hugoboss.com/au/size-charts/menswear-shoes/size-chart_HUGO_m4.html',
    official: false,
  },
  wikipedia: {
    label: 'Wikipedia: Shoe size (הסבר על נקודת פריז, Mondopoint והתקן ISO/TS 19407)',
    href: 'https://en.wikipedia.org/wiki/Shoe_size',
    official: false,
  },
}

export const shoeSourceOrder: ShoeSourceId[] = ['nikeMen', 'nikeWomen', 'nikeKids', 'iso9407', 'hugoBoss', 'wikipedia']

export const shoeGroups: { id: ShoeGroupId; label: string; source: ShoeSourceId; usLabel: string; usAltLabel?: string }[] = [
  { id: 'men', label: 'גברים', source: 'nikeMen', usLabel: 'ארה״ב (גברים)', usAltLabel: 'ארה״ב (נשים)' },
  { id: 'women', label: 'נשים', source: 'nikeWomen', usLabel: 'ארה״ב (נשים)', usAltLabel: 'ארה״ב (גברים)' },
  { id: 'kids', label: 'ילדים ופעוטות', source: 'nikeKids', usLabel: 'ארה״ב (ילדים)' },
]

const MEN: ShoeSize[] = [
  { eu: 35.5, us: '3.5', uk: 3, foot: 21.6, usAlt: '5' },
  { eu: 36, us: '4', uk: 3.5, foot: 22.1, usAlt: '5.5' },
  { eu: 36.5, us: '4.5', uk: 4, foot: 22.4, usAlt: '6' },
  { eu: 37.5, us: '5', uk: 4.5, foot: 22.9, usAlt: '6.5' },
  { eu: 38, us: '5.5', uk: 5, foot: 23.3, usAlt: '7' },
  { eu: 38.5, us: '6', uk: 5.5, foot: 23.7, usAlt: '7.5' },
  { eu: 39, us: '6.5', uk: 6, foot: 24.1, usAlt: '8' },
  { eu: 40, us: '7', uk: 6, foot: 24.6, usAlt: '8.5' },
  { eu: 40.5, us: '7.5', uk: 6.5, foot: 24.9, usAlt: '9' },
  { eu: 41, us: '8', uk: 7, foot: 25.4, usAlt: '9.5' },
  { eu: 42, us: '8.5', uk: 7.5, foot: 25.9, usAlt: '10' },
  { eu: 42.5, us: '9', uk: 8, foot: 26.2, usAlt: '10.5' },
  { eu: 43, us: '9.5', uk: 8.5, foot: 26.7, usAlt: '11' },
  { eu: 44, us: '10', uk: 9, foot: 27.1, usAlt: '11.5' },
  { eu: 44.5, us: '10.5', uk: 9.5, foot: 27.5, usAlt: '12' },
  { eu: 45, us: '11', uk: 10, foot: 27.9, usAlt: '12.5' },
  { eu: 45.5, us: '11.5', uk: 10.5, foot: 28.4, usAlt: '13' },
  { eu: 46, us: '12', uk: 11, foot: 28.7, usAlt: '13.5' },
  { eu: 47, us: '12.5', uk: 11.5, foot: 29.2, usAlt: '14' },
  { eu: 47.5, us: '13', uk: 12, foot: 29.7, usAlt: '14.5' },
  { eu: 48, us: '13.5', uk: 12.5, foot: 30, usAlt: '15' },
  { eu: 48.5, us: '14', uk: 13, foot: 30.5, usAlt: '15.5' },
  { eu: 49, us: '14.5', uk: 13.5, foot: 31, usAlt: '16' },
  { eu: 49.5, us: '15', uk: 14, foot: 31.3, usAlt: '16.5' },
]

const WOMEN: ShoeSize[] = [
  { eu: 33.5, us: '3.5', uk: 1.5, foot: 20.8, usAlt: '2' },
  { eu: 34.5, us: '4', uk: 1.5, foot: 21.1, usAlt: '2.5' },
  { eu: 35, us: '4.5', uk: 2, foot: 21.6, usAlt: '3' },
  { eu: 35.5, us: '5', uk: 2.5, foot: 22.1, usAlt: '3.5' },
  { eu: 36, us: '5.5', uk: 3, foot: 22.4, usAlt: '4' },
  { eu: 36.5, us: '6', uk: 3.5, foot: 22.9, usAlt: '4.5' },
  { eu: 37.5, us: '6.5', uk: 4, foot: 23.3, usAlt: '5' },
  { eu: 38, us: '7', uk: 4.5, foot: 23.7, usAlt: '5.5' },
  { eu: 38.5, us: '7.5', uk: 5, foot: 24.1, usAlt: '6' },
  { eu: 39, us: '8', uk: 5.5, foot: 24.6, usAlt: '6.5' },
  { eu: 40, us: '8.5', uk: 6, foot: 24.9, usAlt: '7' },
  { eu: 40.5, us: '9', uk: 6.5, foot: 25.4, usAlt: '7.5' },
  { eu: 41, us: '9.5', uk: 7, foot: 25.9, usAlt: '8' },
  { eu: 42, us: '10', uk: 7.5, foot: 26.2, usAlt: '8.5' },
  { eu: 42.5, us: '10.5', uk: 8, foot: 26.7, usAlt: '9' },
  { eu: 43, us: '11', uk: 8.5, foot: 27.1, usAlt: '9.5' },
  { eu: 44, us: '11.5', uk: 9, foot: 27.5, usAlt: '10' },
  { eu: 44.5, us: '12', uk: 9.5, foot: 27.9, usAlt: '10.5' },
  { eu: 45, us: '12.5', uk: 10, foot: 28.4, usAlt: '11' },
  { eu: 45.5, us: '13', uk: 10.5, foot: 28.7, usAlt: '11.5' },
]

const KIDS: ShoeSize[] = [
  { eu: 16, us: '1C', uk: 0.5, foot: 9 },
  { eu: 17, us: '2C', uk: 1.5, foot: 10 },
  { eu: 18.5, us: '3C', uk: 2.5, foot: 10.8 },
  { eu: 19.5, us: '4C', uk: 3.5, foot: 11.6 },
  { eu: 21, us: '5C', uk: 4.5, foot: 12.5 },
  { eu: 22, us: '6C', uk: 5.5, foot: 13.3 },
  { eu: 23.5, us: '7C', uk: 6.5, foot: 14.1 },
  { eu: 25, us: '8C', uk: 7.5, foot: 15.1 },
  { eu: 26, us: '9C', uk: 8.5, foot: 15.9 },
  { eu: 27, us: '10C', uk: 9.5, foot: 16.7 },
  { eu: 27.5, us: '10.5C', uk: 10, foot: 17.1 },
  { eu: 28, us: '11C', uk: 10.5, foot: 17.6 },
  { eu: 28.5, us: '11.5C', uk: 11, foot: 17.9 },
  { eu: 29.5, us: '12C', uk: 11.5, foot: 18.4 },
  { eu: 30, us: '12.5C', uk: 12, foot: 18.9 },
  { eu: 31, us: '13C', uk: 12.5, foot: 19.2 },
  { eu: 31.5, us: '13.5C', uk: 13, foot: 19.7 },
  { eu: 32, us: '1Y', uk: 13.5, foot: 20.2 },
  { eu: 33, us: '1.5Y', uk: 1, foot: 20.5 },
  { eu: 33.5, us: '2Y', uk: 1.5, foot: 21 },
  { eu: 34, us: '2.5Y', uk: 2, foot: 21.4 },
  { eu: 35, us: '3Y', uk: 2.5, foot: 21.7 },
  { eu: 35.5, us: '3.5Y', uk: 3, foot: 22.2 },
  { eu: 36, us: '4Y', uk: 3.5, foot: 22.4 },
  { eu: 36.5, us: '4.5Y', uk: 4, foot: 22.7 },
  { eu: 37.5, us: '5Y', uk: 4.5, foot: 23.2 },
  { eu: 38, us: '5.5Y', uk: 5, foot: 23.5 },
  { eu: 38.5, us: '6Y', uk: 5.5, foot: 23.8 },
  { eu: 39, us: '6.5Y', uk: 6, foot: 24.3 },
  { eu: 40, us: '7Y', uk: 6, foot: 24.6 },
]

export const shoeTables: Record<ShoeGroupId, ShoeSize[]> = { men: MEN, women: WOMEN, kids: KIDS }

export const MIN_FOOT_CM = 5
export const MAX_FOOT_CM = 40

export type ParsedFoot = { status: 'empty' } | { status: 'invalid'; error: string } | { status: 'valid'; cm: number }

export const parseFootLength = (input: string): ParsedFoot => {
  const text = input.trim().replace(',', '.')
  if (text === '') return { status: 'empty' }
  if (!/^\d+(\.\d+)?$/.test(text)) return { status: 'invalid', error: 'כתבו מספר בסנטימטרים, למשל 26.5' }
  const cm = Number(text)
  if (cm < MIN_FOOT_CM || cm > MAX_FOOT_CM) {
    return { status: 'invalid', error: `אורך כף רגל צריך להיות בין ${MIN_FOOT_CM} ל-${MAX_FOOT_CM} סנטימטר` }
  }
  return { status: 'valid', cm }
}

export type Conversion =
  | { status: 'found'; size: ShoeSize; index: number }
  | { status: 'below' | 'above'; limit: number }

export const convertFootLength = (group: ShoeGroupId, cm: number): Conversion => {
  const table = shoeTables[group]
  if (cm < table[0].foot - 0.7) return { status: 'below', limit: table[0].foot }
  if (cm > table[table.length - 1].foot) return { status: 'above', limit: table[table.length - 1].foot }
  const index = table.findIndex((size) => size.foot >= cm)
  return { status: 'found', size: table[index], index }
}

export const parisPointEstimate = (cm: number) => Math.round((1.5 * cm + 2) * 2) / 2

export const shoeRowKey = (group: ShoeGroupId, size: ShoeSize) => `${group}-${size.us}-${size.eu}`
