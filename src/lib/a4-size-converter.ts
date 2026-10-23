export type PaperSeries = 'A' | 'B' | 'US'

export type Paper = {
  id: string
  label: string
  series: PaperSeries
  widthMm: number
  heightMm: number
}

const MM_PER_INCH = 25.4

export const DPI_PRESETS = [72, 96, 150, 300] as const
export const DEFAULT_DPI = 300
export const MIN_DPI = 1
export const MAX_DPI = 1200
export const PAPER_REVIEWED = '2026-10-23'

const aSeries: [number, number][] = [
  [841, 1189],
  [594, 841],
  [420, 594],
  [297, 420],
  [210, 297],
  [148, 210],
  [105, 148],
  [74, 105],
  [52, 74],
  [37, 52],
  [26, 37],
]

const bSeries: [number, number][] = [
  [1000, 1414],
  [707, 1000],
  [500, 707],
  [353, 500],
  [250, 353],
  [176, 250],
  [125, 176],
  [88, 125],
  [62, 88],
  [44, 62],
  [31, 44],
]

export const papers: Paper[] = [
  ...aSeries.map(
    ([widthMm, heightMm], index): Paper => ({ id: `a${index}`, label: `A${index}`, series: 'A', widthMm, heightMm }),
  ),
  ...bSeries.map(
    ([widthMm, heightMm], index): Paper => ({ id: `b${index}`, label: `B${index}`, series: 'B', widthMm, heightMm }),
  ),
  { id: 'letter', label: 'US Letter', series: 'US', widthMm: 8.5 * MM_PER_INCH, heightMm: 11 * MM_PER_INCH },
]

export const aPapers = papers.filter((paper) => paper.series === 'A')
export const bPapers = papers.filter((paper) => paper.series === 'B')
export const usPapers = papers.filter((paper) => paper.series === 'US')

export const DEFAULT_PAPER_ID = 'a4'

export const findPaper = (id: string): Paper => papers.find((paper) => paper.id === id) ?? papers[4]

export const mmToPixels = (mm: number, dpi: number): number => Math.round((mm / MM_PER_INCH) * dpi)

export const mmToInches = (mm: number): number => mm / MM_PER_INCH

export type Dimensions = { widthMm: number; heightMm: number }

export const orient = (paper: Paper, landscape: boolean): Dimensions =>
  landscape
    ? { widthMm: paper.heightMm, heightMm: paper.widthMm }
    : { widthMm: paper.widthMm, heightMm: paper.heightMm }

export const parseDpi = (value: string): number | null => {
  const clean = value.trim()
  if (!/^\d+$/.test(clean)) return null
  const parsed = Number(clean)
  return parsed >= MIN_DPI && parsed <= MAX_DPI ? parsed : null
}

export const dpiError = (value: string): string => {
  if (!value.trim()) return ''
  return parseDpi(value) === null ? `הקלידו מספר שלם בין ${MIN_DPI} ל-${MAX_DPI}.` : ''
}

export const formatNumber = (value: number, digits: number): string => {
  const fixed = value.toFixed(digits)
  return digits > 0 ? fixed.replace(/\.?0+$/, '') : fixed
}

export const formatPixels = (widthMm: number, heightMm: number, dpi: number): string =>
  `${mmToPixels(widthMm, dpi)} × ${mmToPixels(heightMm, dpi)}`
