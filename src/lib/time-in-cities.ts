import { cityById, type City } from './time-difference'

export const TIME_IN_HUB = '/tools/time-in'

export type TimeInPage = { slug: string; place: string; inPlace: string; cityId: string; areaNote?: string }

export const timeInPages: TimeInPage[] = [
  { slug: 'new-york', place: 'ניו יורק', inPlace: 'בניו יורק', cityId: 'new-york' },
  { slug: 'los-angeles', place: 'לוס אנג׳לס', inPlace: 'בלוס אנג׳לס', cityId: 'los-angeles' },
  { slug: 'london', place: 'לונדון', inPlace: 'בלונדון', cityId: 'london' },
  { slug: 'paris', place: 'פריז', inPlace: 'בפריז', cityId: 'paris' },
  {
    slug: 'germany',
    place: 'גרמניה',
    inPlace: 'בגרמניה',
    cityId: 'berlin',
    areaNote: 'בכל גרמניה יש אזור זמן אחד, כך שהשעה בברלין, במינכן ובפרנקפורט זהה.',
  },
  {
    slug: 'italy',
    place: 'איטליה',
    inPlace: 'באיטליה',
    cityId: 'rome',
    areaNote: 'בכל איטליה יש אזור זמן אחד, כולל מילאנו, סיציליה וסרדיניה.',
  },
  {
    slug: 'spain',
    place: 'ספרד',
    inPlace: 'בספרד',
    cityId: 'madrid',
    areaNote: 'השעה במדריד ובברצלונה זהה. באיים הקנריים השעה מאחרת בשעה אחת אחרי שאר ספרד.',
  },
  {
    slug: 'greece',
    place: 'יוון',
    inPlace: 'ביוון',
    cityId: 'athens',
    areaNote: 'בכל יוון יש אזור זמן אחד, כולל כרתים, רודוס וכל שאר האיים.',
  },
  {
    slug: 'turkey',
    place: 'טורקיה',
    inPlace: 'בטורקיה',
    cityId: 'istanbul',
    areaNote: 'בכל טורקיה יש אזור זמן אחד, ומאז 2016 היא לא מזיזה את השעון בין קיץ לחורף.',
  },
  { slug: 'moscow', place: 'מוסקבה', inPlace: 'במוסקבה', cityId: 'moscow' },
  { slug: 'ukraine', place: 'אוקראינה', inPlace: 'באוקראינה', cityId: 'kyiv' },
  {
    slug: 'dubai',
    place: 'דובאי',
    inPlace: 'בדובאי',
    cityId: 'dubai',
    areaNote: 'השעה בדובאי זהה לשעה באבו דאבי ובכל איחוד האמירויות, ואין שם שעון קיץ.',
  },
  {
    slug: 'india',
    place: 'הודו',
    inPlace: 'בהודו',
    cityId: 'delhi',
    areaNote: 'בכל הודו יש אזור זמן אחד, כך שהשעה בדלהי, במומבאי ובגואה זהה, ואין בה שעון קיץ.',
  },
  {
    slug: 'thailand',
    place: 'תאילנד',
    inPlace: 'בתאילנד',
    cityId: 'bangkok',
    areaNote:
      'בכל תאילנד יש אזור זמן אחד ואין בה שעון קיץ, כך שהשעה בפוקט, בקו סמוי, בקו פנגן ובצ׳יאנג מאי זהה לשעה בבנגקוק.',
  },
  {
    slug: 'china',
    place: 'סין',
    inPlace: 'בסין',
    cityId: 'beijing',
    areaNote: 'בכל סין יש אזור זמן אחד, כך שהשעה בבייג׳ינג ובשנגחאי זהה, ואין בה שעון קיץ.',
  },
  {
    slug: 'japan',
    place: 'יפן',
    inPlace: 'ביפן',
    cityId: 'tokyo',
    areaNote: 'בכל יפן יש אזור זמן אחד ואין בה שעון קיץ.',
  },
  {
    slug: 'sydney',
    place: 'סידני',
    inPlace: 'בסידני',
    cityId: 'sydney',
    areaNote: 'באוסטרליה יש כמה אזורי זמן. השעה במלבורן זהה לשעה בסידני, ובפרת׳ השעה מאחרת בשעתיים עד שלוש שעות.',
  },
  { slug: 'toronto', place: 'טורונטו', inPlace: 'בטורונטו', cityId: 'toronto' },
  {
    slug: 'brazil',
    place: 'ברזיל',
    inPlace: 'בברזיל',
    cityId: 'sao-paulo',
    areaNote:
      'העמוד מציג את השעה בסאו פאולו, שהיא גם השעה בריו דה ז׳ניירו ובברזיליה. בצפון ובמערב ברזיל, למשל במנאוס, השעה מאחרת בשעה או יותר.',
  },
]

export const timeInPath = (slug: string) => `${TIME_IN_HUB}/${slug}`

export const timeInPage = (slug: string) => timeInPages.find((page) => page.slug === slug)

export const timeInCity = (page: TimeInPage): City => cityById(page.cityId) as City
