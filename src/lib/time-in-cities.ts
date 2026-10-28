import { cityById, type City } from './time-difference'

export const TIME_IN_HUB = '/tools/time-in'

export type TimeInPage = { slug: string; place: string; inPlace: string; cityId: string }

export const timeInPages: TimeInPage[] = [
  { slug: 'new-york', place: 'ניו יורק', inPlace: 'בניו יורק', cityId: 'new-york' },
  { slug: 'los-angeles', place: 'לוס אנג׳לס', inPlace: 'בלוס אנג׳לס', cityId: 'los-angeles' },
  { slug: 'london', place: 'לונדון', inPlace: 'בלונדון', cityId: 'london' },
  { slug: 'paris', place: 'פריז', inPlace: 'בפריז', cityId: 'paris' },
  { slug: 'germany', place: 'גרמניה', inPlace: 'בגרמניה', cityId: 'berlin' },
  { slug: 'italy', place: 'איטליה', inPlace: 'באיטליה', cityId: 'rome' },
  { slug: 'spain', place: 'ספרד', inPlace: 'בספרד', cityId: 'madrid' },
  { slug: 'greece', place: 'יוון', inPlace: 'ביוון', cityId: 'athens' },
  { slug: 'turkey', place: 'טורקיה', inPlace: 'בטורקיה', cityId: 'istanbul' },
  { slug: 'moscow', place: 'מוסקבה', inPlace: 'במוסקבה', cityId: 'moscow' },
  { slug: 'ukraine', place: 'אוקראינה', inPlace: 'באוקראינה', cityId: 'kyiv' },
  { slug: 'dubai', place: 'דובאי', inPlace: 'בדובאי', cityId: 'dubai' },
  { slug: 'india', place: 'הודו', inPlace: 'בהודו', cityId: 'delhi' },
  { slug: 'thailand', place: 'תאילנד', inPlace: 'בתאילנד', cityId: 'bangkok' },
  { slug: 'china', place: 'סין', inPlace: 'בסין', cityId: 'beijing' },
  { slug: 'japan', place: 'יפן', inPlace: 'ביפן', cityId: 'tokyo' },
  { slug: 'sydney', place: 'סידני', inPlace: 'בסידני', cityId: 'sydney' },
  { slug: 'toronto', place: 'טורונטו', inPlace: 'בטורונטו', cityId: 'toronto' },
  { slug: 'brazil', place: 'ברזיל', inPlace: 'בברזיל', cityId: 'sao-paulo' },
]

export const timeInPath = (slug: string) => `${TIME_IN_HUB}/${slug}`

export const timeInPage = (slug: string) => timeInPages.find((page) => page.slug === slug)

export const timeInCity = (page: TimeInPage): City => cityById(page.cityId) as City
