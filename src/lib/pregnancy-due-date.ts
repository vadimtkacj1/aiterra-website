export const PREGNANCY_DAYS = 280
export const DEFAULT_CYCLE_DAYS = 28
export const MIN_CYCLE_DAYS = 21
export const MAX_CYCLE_DAYS = 45
export const CONCEPTION_OFFSET_DAYS = 14
export const MAX_TRACKED_DAYS = 42 * 7

const DAY_MS = 24 * 60 * 60 * 1000

export type PregnancyMode = 'lmp' | 'conception'

export type Trimester = 1 | 2 | 3

export type MilestoneStatus = 'upcoming' | 'now' | 'passed'

export type Milestone = {
  id: string
  title: string
  fromWeek: number
  toWeek: number
  note: string
}

export type MilestoneRow = Milestone & {
  status: MilestoneStatus
  startDay: number
  endDay: number
}

export type PregnancyInputs = {
  mode: PregnancyMode
  day: number
  cycleDays: number
}

export type PregnancyResult = {
  startDay: number
  dueDay: number
  fullTermFrom: number
  fullTermTo: number
  daysPregnant: number | null
  weeks: number | null
  extraDays: number | null
  trimester: Trimester | null
  daysLeft: number | null
  progress: number | null
  phase: 'future' | 'ongoing' | 'beyond'
  milestones: MilestoneRow[]
}

export const MILESTONES: Milestone[] = [
  {
    id: 'early-scan',
    title: 'אולטרסאונד הריון צעיר',
    fromWeek: 6,
    toWeek: 7,
    note: 'מאשר את ההריון, את מיקומו ואת מספר העוברים.',
  },
  {
    id: 'nuchal',
    title: 'שקיפות עורפית',
    fromWeek: 11,
    toWeek: 13,
    note: 'אולטרסאונד לצד בדיקת דם סקר, בין שבוע 11 לשבוע 13 ושישה ימים.',
  },
  {
    id: 'early-anatomy',
    title: 'סקירת מערכות מוקדמת',
    fromWeek: 14,
    toWeek: 16,
    note: 'בדיקה פרטית בדרך כלל, מחוץ לסל הבריאות.',
  },
  {
    id: 'triple',
    title: 'תבחין משולש (חלבון עוברי)',
    fromWeek: 16,
    toWeek: 19,
    note: 'בדיקת דם סקר של השליש השני.',
  },
  {
    id: 'late-anatomy',
    title: 'סקירת מערכות מאוחרת',
    fromWeek: 21,
    toWeek: 24,
    note: 'הסקירה המרכזית של מבנה העובר.',
  },
  {
    id: 'glucose',
    title: 'העמסת סוכר 50 גרם',
    fromWeek: 24,
    toWeek: 28,
    note: 'בדיקת סקר לסוכרת הריון, ללא צום.',
  },
]

export function toDay(year: number, month: number, date: number) {
  return Math.round(Date.UTC(year, month - 1, date) / DAY_MS)
}

export function parseDay(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const date = Number(match[3])
  const day = toDay(year, month, date)
  const check = new Date(day * DAY_MS)
  if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== date) {
    return null
  }
  return day
}

export function dayToIso(day: number) {
  return new Date(day * DAY_MS).toISOString().slice(0, 10)
}

export function todayDay() {
  const now = new Date()
  return toDay(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

const longFormat = new Intl.DateTimeFormat('he-IL', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const shortFormat = new Intl.DateTimeFormat('he-IL', { timeZone: 'UTC', day: 'numeric', month: 'long' })

export const formatLong = (day: number) => longFormat.format(new Date(day * DAY_MS))
export const formatShort = (day: number) => shortFormat.format(new Date(day * DAY_MS))

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function lmpEquivalent({ mode, day, cycleDays }: PregnancyInputs) {
  if (mode === 'conception') return day - CONCEPTION_OFFSET_DAYS
  return day + (cycleDays - DEFAULT_CYCLE_DAYS)
}

export function trimesterOf(weeks: number): Trimester {
  if (weeks < 14) return 1
  if (weeks < 28) return 2
  return 3
}

export const trimesterLabels: Record<Trimester, string> = {
  1: 'שליש ראשון',
  2: 'שליש שני',
  3: 'שליש שלישי',
}

export function weeksAndDays(daysPregnant: number) {
  return { weeks: Math.floor(daysPregnant / 7), extraDays: daysPregnant % 7 }
}

export function weeksLabel(weeks: number, extraDays: number) {
  const weekPart = weeks === 1 ? 'שבוע 1' : `שבוע ${weeks}`
  if (extraDays === 0) return weekPart
  return `${weekPart} ו-${extraDays === 1 ? 'יום' : `${extraDays} ימים`}`
}

function milestoneRows(startDay: number, daysPregnant: number | null): MilestoneRow[] {
  return MILESTONES.map((milestone) => {
    const startOffset = milestone.fromWeek * 7
    const endOffset = milestone.toWeek * 7 + 6
    let status: MilestoneStatus = 'upcoming'
    if (daysPregnant !== null) {
      if (daysPregnant > endOffset) status = 'passed'
      else if (daysPregnant >= startOffset) status = 'now'
    }
    return { ...milestone, status, startDay: startDay + startOffset, endDay: startDay + endOffset }
  })
}

export function calculate(inputs: PregnancyInputs, today: number | null): PregnancyResult {
  const effectiveStart = lmpEquivalent(inputs)
  const dueFromLmp = effectiveStart + PREGNANCY_DAYS
  const base = {
    startDay: effectiveStart,
    dueDay: dueFromLmp,
    fullTermFrom: effectiveStart + 39 * 7,
    fullTermTo: effectiveStart + 40 * 7 + 6,
  }
  if (today === null) {
    return {
      ...base,
      daysPregnant: null,
      weeks: null,
      extraDays: null,
      trimester: null,
      daysLeft: null,
      progress: null,
      phase: 'ongoing',
      milestones: milestoneRows(effectiveStart, null),
    }
  }
  const daysPregnant = today - effectiveStart
  if (daysPregnant < 0) {
    return {
      ...base,
      daysPregnant,
      weeks: null,
      extraDays: null,
      trimester: null,
      daysLeft: dueFromLmp - today,
      progress: null,
      phase: 'future',
      milestones: milestoneRows(effectiveStart, null),
    }
  }
  const { weeks, extraDays } = weeksAndDays(daysPregnant)
  return {
    ...base,
    daysPregnant,
    weeks,
    extraDays,
    trimester: trimesterOf(weeks),
    daysLeft: dueFromLmp - today,
    progress: clamp(daysPregnant / PREGNANCY_DAYS, 0, 1),
    phase: daysPregnant > MAX_TRACKED_DAYS ? 'beyond' : 'ongoing',
    milestones: milestoneRows(effectiveStart, daysPregnant),
  }
}
