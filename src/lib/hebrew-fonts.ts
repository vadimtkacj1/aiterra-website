export type FontCategory = 'sans' | 'serif' | 'display' | 'handwriting' | 'monospace'
export type FontLicense = 'OFL'
export type CodeFormat = 'html' | 'css'

export type HebrewFont = {
  family: string
  category: FontCategory
  weights: number[]
  license: FontLicense
  nikud: boolean
}

export type FontChoice = { family: string; weight: number }

export const FONTS_CHECKED_ON = 'אוקטובר 2026'

export const hebrewFonts: HebrewFont[] = [
  {
    family: 'Open Sans',
    category: 'sans',
    weights: [300, 400, 500, 600, 700, 800],
    license: 'OFL',
    nikud: true,
  },
  { family: 'Google Sans', category: 'sans', weights: [400, 500, 600, 700], license: 'OFL', nikud: true },
  { family: 'Arimo', category: 'sans', weights: [400, 500, 600, 700], license: 'OFL', nikud: true },
  {
    family: 'Rubik',
    category: 'sans',
    weights: [300, 400, 500, 600, 700, 800, 900],
    license: 'OFL',
    nikud: true,
  },
  {
    family: 'Heebo',
    category: 'sans',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    license: 'OFL',
    nikud: true,
  },
  {
    family: 'Assistant',
    category: 'sans',
    weights: [200, 300, 400, 500, 600, 700, 800],
    license: 'OFL',
    nikud: true,
  },
  {
    family: 'M PLUS Rounded 1c',
    category: 'sans',
    weights: [100, 300, 400, 500, 700, 800, 900],
    license: 'OFL',
    nikud: false,
  },
  { family: 'Fredoka', category: 'sans', weights: [300, 400, 500, 600, 700], license: 'OFL', nikud: true },
  {
    family: 'Frank Ruhl Libre',
    category: 'serif',
    weights: [300, 400, 500, 600, 700, 800, 900],
    license: 'OFL',
    nikud: true,
  },
  { family: 'Tinos', category: 'serif', weights: [400, 700], license: 'OFL', nikud: true },
  { family: 'Varela Round', category: 'sans', weights: [400], license: 'OFL', nikud: true },
  {
    family: 'M PLUS 1p',
    category: 'sans',
    weights: [100, 300, 400, 500, 700, 800, 900],
    license: 'OFL',
    nikud: false,
  },
  { family: 'Amatic SC', category: 'handwriting', weights: [400, 700], license: 'OFL', nikud: true },
  {
    family: 'Noto Sans Hebrew',
    category: 'sans',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    license: 'OFL',
    nikud: true,
  },
  { family: 'Cardo', category: 'serif', weights: [400, 700], license: 'OFL', nikud: true },
  { family: 'Suez One', category: 'serif', weights: [400], license: 'OFL', nikud: true },
  { family: 'Bellefair', category: 'serif', weights: [400], license: 'OFL', nikud: true },
  { family: 'Secular One', category: 'sans', weights: [400], license: 'OFL', nikud: true },
  { family: 'Cousine', category: 'monospace', weights: [400, 700], license: 'OFL', nikud: true },
  { family: 'Alef', category: 'sans', weights: [400, 700], license: 'OFL', nikud: true },
  { family: 'Libertinus Serif', category: 'serif', weights: [400, 600, 700], license: 'OFL', nikud: true },
  { family: 'Bona Nova SC', category: 'serif', weights: [400, 700], license: 'OFL', nikud: true },
  {
    family: 'IBM Plex Sans Hebrew',
    category: 'sans',
    weights: [100, 200, 300, 400, 500, 600, 700],
    license: 'OFL',
    nikud: true,
  },
  { family: 'Miriam Libre', category: 'sans', weights: [400, 500, 600, 700], license: 'OFL', nikud: true },
  { family: 'Rubik Dirt', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Storm', category: 'display', weights: [400], license: 'OFL', nikud: true },
  {
    family: 'Noto Serif Hebrew',
    category: 'serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    license: 'OFL',
    nikud: true,
  },
  { family: 'Rubik Spray Paint', category: 'display', weights: [400], license: 'OFL', nikud: true },
  {
    family: 'Cascadia Code',
    category: 'sans',
    weights: [200, 300, 400, 500, 600, 700],
    license: 'OFL',
    nikud: false,
  },
  {
    family: 'Handjet',
    category: 'display',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    license: 'OFL',
    nikud: true,
  },
  { family: 'David Libre', category: 'serif', weights: [400, 500, 700], license: 'OFL', nikud: true },
  { family: 'Rubik Wet Paint', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Solitreo', category: 'handwriting', weights: [400], license: 'OFL', nikud: false },
  { family: 'Rubik Glitch', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Karantina', category: 'display', weights: [300, 400, 700], license: 'OFL', nikud: true },
  { family: 'Rubik Moonrocks', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Doodle Shadow', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Bona Nova', category: 'serif', weights: [400, 700], license: 'OFL', nikud: true },
  { family: 'Rubik Distressed', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Iso', category: 'display', weights: [400], license: 'OFL', nikud: true },
  {
    family: 'Noto Rashi Hebrew',
    category: 'serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    license: 'OFL',
    nikud: true,
  },
  { family: 'Gveret Levin', category: 'handwriting', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Burned', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Puddles', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Bubbles', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Gemstones', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Glitch Pop', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik 80s Fade', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Pixels', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Maps', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Vinyl', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Broken Fax', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Lines', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Scribble', category: 'display', weights: [400], license: 'OFL', nikud: true },
  {
    family: 'Playpen Sans Hebrew',
    category: 'handwriting',
    weights: [100, 200, 300, 400, 500, 600, 700, 800],
    license: 'OFL',
    nikud: true,
  },
  { family: 'Lunasima', category: 'sans', weights: [400, 700], license: 'OFL', nikud: false },
  {
    family: 'Cascadia Mono',
    category: 'sans',
    weights: [200, 300, 400, 500, 600, 700],
    license: 'OFL',
    nikud: false,
  },
  { family: 'Rubik Microbe', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Marker Hatch', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Beastly', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Doodle Triangles', category: 'display', weights: [400], license: 'OFL', nikud: true },
  { family: 'Rubik Maze', category: 'display', weights: [400], license: 'OFL', nikud: true },
]

export const categoryOrder: FontCategory[] = ['sans', 'serif', 'display', 'handwriting', 'monospace']

export const categoryLabels: Record<FontCategory, string> = {
  sans: 'ללא סריפים',
  serif: 'עם סריפים',
  display: 'תצוגה',
  handwriting: 'כתב יד',
  monospace: 'רוחב קבוע',
}

export const licenseNames: Record<FontLicense, string> = {
  OFL: 'SIL Open Font License 1.1',
}

const genericFamilies: Record<FontCategory, string> = {
  sans: 'sans-serif',
  serif: 'serif',
  display: 'system-ui',
  handwriting: 'cursive',
  monospace: 'monospace',
}

export const weightNames: Record<number, string> = {
  100: 'דק במיוחד',
  200: 'דק מאוד',
  300: 'דק',
  400: 'רגיל',
  500: 'בינוני',
  600: 'חצי מודגש',
  700: 'מודגש',
  800: 'מודגש מאוד',
  900: 'שחור',
}

export const DEFAULT_PREVIEW_TEXT = 'מאפיית הגפן\nלחם מחמצת טרי כל בוקר מ-7:00'
export const EMPTY_PREVIEW_TEXT = 'אבגדהוזחטיכלמנסעפצקרשת ךםןףץ 0123456789'
export const PAIR_BODY_TEXT =
  'זו פסקה לדוגמה, כדי לראות איך הפונט נקרא בטקסט ארוך. כך נראים בו טלפון כמו 03-1234567, מחיר של 150 ₪ ושעה כמו 9:30, סימני פיסוק (סוגריים, מירכאות ״כפולות״ ונקודה), ומילה באנגלית כמו WhatsApp באמצע משפט.'
export const MAX_TEXT_LENGTH = 120

export const DEFAULT_PAIR: { heading: FontChoice; body: FontChoice } = {
  heading: { family: 'Frank Ruhl Libre', weight: 700 },
  body: { family: 'Assistant', weight: 400 },
}

const hebrewAliases: [prefix: string, names: string[]][] = [
  ['Open Sans', ['אופן סנס', 'אופן סאנס']],
  ['Google Sans', ['גוגל סנס', 'גוגל סאנס']],
  ['Arimo', ['ארימו']],
  ['Rubik', ['רוביק']],
  ['Heebo', ['היבו']],
  ['Assistant', ['אסיסטנט']],
  ['Fredoka', ['פרדוקה']],
  ['Frank Ruhl Libre', ['פרנק ריהל', 'פרנק רוהל']],
  ['Tinos', ['טינוס']],
  ['Varela Round', ['ורלה', 'וארלה']],
  ['Amatic SC', ['אמטיק']],
  ['Noto', ['נוטו']],
  ['Cardo', ['קרדו']],
  ['Suez One', ['סואץ']],
  ['Bellefair', ['בלפייר']],
  ['Secular One', ['סקולר', 'סקולאר']],
  ['Cousine', ['קוזין']],
  ['Alef', ['אלף']],
  ['IBM Plex Sans Hebrew', ['פלקס']],
  ['Miriam Libre', ['מרים']],
  ['David Libre', ['דוד']],
  ['Karantina', ['קרנטינה']],
  ['Gveret Levin', ['גברת לוין']],
  ['Playpen Sans Hebrew', ['פלייפן']],
]

const normalize = (value: string) => value.toLowerCase().replace(/[\s\-'"׳״]/g, '')

export const findFont = (family: string) => hebrewFonts.find((font) => font.family === family)

export function nearestWeight(weights: number[], target: number) {
  return weights.reduce((best, weight) => (Math.abs(weight - target) < Math.abs(best - target) ? weight : best))
}

export const defaultWeight = (font: HebrewFont) => nearestWeight(font.weights, 400)

export const fontFamilyValue = (font: HebrewFont) => `'${font.family}', ${genericFamilies[font.category]}`

export const specimenUrl = (family: string) => `https://fonts.google.com/specimen/${family.replace(/ /g, '+')}`

export function matchesQuery(font: HebrewFont, query: string) {
  const needle = normalize(query)
  if (!needle) return true
  if (normalize(font.family).includes(needle)) return true
  return hebrewAliases.some(
    ([prefix, names]) => font.family.startsWith(prefix) && names.some((name) => normalize(name).includes(needle)),
  )
}

export function stylesheetUrl(choices: FontChoice[]) {
  const families = new Map<string, Set<number>>()
  for (const { family, weight } of choices) {
    families.set(family, (families.get(family) ?? new Set()).add(weight))
  }
  const params = [...families].map(([family, weightSet]) => {
    const name = family.replace(/ /g, '+')
    const weights = [...weightSet].sort((a, b) => a - b)
    const regularOnly = weights.length === 1 && weights[0] === 400
    return regularOnly ? `family=${name}` : `family=${name}:wght@${weights.join(';')}`
  })
  return `https://fonts.googleapis.com/css2?${params.join('&')}&display=swap`
}

function embedCode(choices: FontChoice[], format: CodeFormat) {
  const url = stylesheetUrl(choices)
  if (format === 'css') return `@import url('${url}');`
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link href="${url}" rel="stylesheet">`,
  ].join('\n')
}

function declarations(font: HebrewFont, weight: number, indent: string) {
  const lines = [`font-family: ${fontFamilyValue(font)};`]
  if (weight !== 400) lines.push(`font-weight: ${weight};`)
  return lines.map((line) => `${indent}${line}`).join('\n')
}

export function singleFontCode(font: HebrewFont, weight: number, format: CodeFormat) {
  return `${embedCode([{ family: font.family, weight }], format)}\n\n${declarations(font, weight, '')}`
}

export function pairCode(heading: FontChoice, body: FontChoice, format: CodeFormat) {
  const headingFont = findFont(heading.family)
  const bodyFont = findFont(body.family)
  if (!headingFont || !bodyFont) return ''
  return [
    embedCode([heading, body], format),
    '',
    'h1, h2, h3 {',
    declarations(headingFont, heading.weight, '  '),
    '}',
    '',
    'body {',
    declarations(bodyFont, body.weight, '  '),
    '}',
  ].join('\n')
}

export const categoryCounts = categoryOrder.map((category) => ({
  category,
  count: hebrewFonts.filter((font) => font.category === category).length,
}))

export const nikudCount = hebrewFonts.filter((font) => font.nikud).length
