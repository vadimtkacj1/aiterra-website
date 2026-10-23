export type DogGender = 'm' | 'f' | 'u'
export type DogSize = 's' | 'l' | 'a'
export type DogStyle = 'hebrew' | 'english' | 'food' | 'funny'

export type DogName = {
  name: string
  gender: DogGender
  size: DogSize
  style: DogStyle
}

export const FAVORITES_KEY = 'aiterra-dog-name-favorites'
export const MAX_FAVORITES = 30

export const genderFilters: { value: DogGender | 'all'; label: string }[] = [
  { value: 'all', label: 'הכול' },
  { value: 'm', label: 'זכר' },
  { value: 'f', label: 'נקבה' },
]

export const sizeFilters: { value: DogSize | 'all'; label: string }[] = [
  { value: 'all', label: 'כל הגדלים' },
  { value: 's', label: 'כלב קטן' },
  { value: 'l', label: 'כלב גדול' },
]

export const styleFilters: { value: DogStyle | 'all'; label: string }[] = [
  { value: 'all', label: 'כל הסגנונות' },
  { value: 'hebrew', label: 'עברי' },
  { value: 'english', label: 'אנגלי' },
  { value: 'food', label: 'אוכל' },
  { value: 'funny', label: 'מצחיק' },
]

const group = (style: DogStyle, gender: DogGender, size: DogSize, names: string): DogName[] =>
  names
    .trim()
    .split(/\s*,\s*/)
    .map((name) => ({ name, gender, size, style }))

export const dogNames: DogName[] = [
  ...group('hebrew', 'm', 'a', 'אריק, ברק, נועם, אורי, איתן, עמית, ירון, עידו, נמרוד, אלון, שמשון, גדעון, יונתן'),
  ...group('hebrew', 'm', 'l', 'אריה, כפיר, זאב, גיבור, אדיר, תותח, לביא, דוב'),
  ...group('hebrew', 'm', 's', 'פיצי, גוזל, גמד, זעיר, פרפר, ניצן, ציפי'),
  ...group('hebrew', 'f', 'a', 'שירה, מיקה, ליאת, שקד, ענבר, נוגה, תמר, אורנה, נעמי, יעל, גפן'),
  ...group('hebrew', 'f', 'l', 'אריאלה, לביאה, דבורה, נמרה, אמירה, גבורה'),
  ...group('hebrew', 'f', 's', 'פנינה, לילי, ציפור, טליה, נחמה, פרח, גינה'),
  ...group('hebrew', 'u', 'a', 'שחר, גל, טל, אור, ים, רוני, אביב, שלג, ענן, רוח, נחל, כוכב, שביט, חול, סלע, ברקת'),

  ...group('english', 'm', 'a', 'Max, Charlie, Buddy, Rocky, Jack, Cooper, Oscar, Leo, Bruno, Simba, Finn, Louie, Gus, Harley, Rusty, Archie'),
  ...group('english', 'm', 'l', 'Zeus, Thor, Rex, Duke, Bear, Titan, Atlas, Apollo, Ranger, Chase, Hunter'),
  ...group('english', 'm', 's', 'Teddy, Toby, Milo, Ziggy, Bobby, Peanut, Pixel, Mini'),
  ...group('english', 'f', 'a', 'Luna, Bella, Lucy, Mia, Molly, Sophie, Ruby, Maya, Stella, Zoe, Chloe, Layla, Lily, Millie'),
  ...group('english', 'f', 'l', 'Nala, Roxy, Athena, Xena, Sasha, Storm, Hera'),
  ...group('english', 'f', 's', 'Coco, Lola, Daisy, Penny, Pixie, Tiny, Bonnie'),

  ...group('food', 'u', 'a', 'פלאפל, חומוס, פיתה, פופקורן, ביסקוויט, קרואסון, נס, שוקו, פסטה, פלפל, זיתים, קינמון, ממרח'),
  ...group('food', 'u', 'l', 'שניצל, שווארמה, בורקס, קבב, נקניק, שישליק, סטייק'),
  ...group('food', 'u', 's', 'ביסלי, בייגלה, קרוטון, פתית, פירור, גרגיר, אגוז, מרשמלו'),
  ...group('food', 'f', 'a', 'שוקולדה, וניל, עוגיה, סוכריה, פטל, תות, אבטיחה, לימונדה'),
  ...group('food', 'm', 'a', 'קפה, אספרסו, מוקה, טוסט, חצילון, סלט, ממתק'),

  ...group('funny', 'm', 'a', 'בוס, מנהל, שוטר, רמבו, שמוליק, ויקטור, פרופסור, קפטן, סוכן, גנרל'),
  ...group('funny', 'm', 'l', 'מחסל, גולייתי, הענק, טרקטור, מגדל, באלדוזר'),
  ...group('funny', 'm', 's', 'נמלה, קוצי, טיפה, בועה, קקטוס, מיקרו'),
  ...group('funny', 'f', 'a', 'מלכה, נסיכה, דיווה, גברת, מיס, מאמי, בוסית'),
  ...group('funny', 'u', 'a', 'וייז, גוגל, ווטסאפ, אינסטגרם, קליק, מייל, פיקסל, אקסל, ביטקוין'),
]

export type Filters = {
  gender: DogGender | 'all'
  size: DogSize | 'all'
  style: DogStyle | 'all'
}

export const filterNames = (filters: Filters): DogName[] =>
  dogNames.filter(
    (item) =>
      (filters.gender === 'all' || item.gender === 'u' || item.gender === filters.gender) &&
      (filters.size === 'all' || item.size === 'a' || item.size === filters.size) &&
      (filters.style === 'all' || item.style === filters.style),
  )

export const pickRandom = (list: DogName[], current: string, random: () => number): string | null => {
  if (list.length === 0) return null
  const pool = list.length > 1 ? list.filter((item) => item.name !== current) : list
  return pool[Math.floor(random() * pool.length)].name
}

export const parseFavorites = (raw: string | null): string[] => {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string').slice(0, MAX_FAVORITES)
  } catch {
    return []
  }
}

export const toggleFavorite = (favorites: string[], name: string): string[] =>
  favorites.includes(name)
    ? favorites.filter((item) => item !== name)
    : favorites.length >= MAX_FAVORITES
      ? favorites
      : [...favorites, name]
