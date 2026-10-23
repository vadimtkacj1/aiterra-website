export type Course = {
  id: number
  name: string
  credits: string
  grade: string
  pass: boolean
}

export const MAX_COURSES = 60
export const MAX_CREDITS = 30
export const GPA_REVIEWED = '2026-10-23'

export const parseDecimal = (value: string): number | null => {
  const clean = value.trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(clean)) return null
  const parsed = Number(clean)
  return Number.isFinite(parsed) ? parsed : null
}

export const creditsError = (value: string): string => {
  if (!value.trim()) return ''
  const parsed = parseDecimal(value)
  if (parsed === null) return 'הקלידו מספר, למשל 3 או 2.5.'
  if (parsed <= 0 || parsed > MAX_CREDITS) return `נקודות זכות: מספר בין 0.5 ל-${MAX_CREDITS}.`
  return ''
}

export const gradeError = (value: string): string => {
  if (!value.trim()) return ''
  const parsed = parseDecimal(value)
  if (parsed === null) return 'הקלידו ציון כמספר.'
  if (parsed > 100) return 'ציון הוא מספר בין 0 ל-100.'
  return ''
}

export type CountedCourse = { credits: number; grade: number }

export const countedCourses = (courses: Course[]): CountedCourse[] =>
  courses.flatMap((course) => {
    if (course.pass) return []
    const credits = parseDecimal(course.credits)
    const grade = parseDecimal(course.grade)
    if (credits === null || grade === null) return []
    if (credits <= 0 || credits > MAX_CREDITS || grade > 100) return []
    return [{ credits, grade }]
  })

export const passFailCredits = (courses: Course[]): number =>
  courses.reduce((sum, course) => {
    if (!course.pass) return sum
    const credits = parseDecimal(course.credits)
    return credits !== null && credits > 0 && credits <= MAX_CREDITS ? sum + credits : sum
  }, 0)

export type GpaSummary = {
  average: number | null
  weightedCredits: number
  weightedSum: number
}

export const summarize = (courses: Course[]): GpaSummary => {
  const counted = countedCourses(courses)
  const weightedCredits = counted.reduce((sum, item) => sum + item.credits, 0)
  const weightedSum = counted.reduce((sum, item) => sum + item.credits * item.grade, 0)
  return {
    average: weightedCredits > 0 ? weightedSum / weightedCredits : null,
    weightedCredits,
    weightedSum,
  }
}

export type TargetOutcome =
  | { kind: 'incomplete' }
  | { kind: 'already'; needed: number }
  | { kind: 'reachable'; needed: number }
  | { kind: 'impossible'; needed: number; best: number }

export const requiredAverage = (
  summary: GpaSummary,
  target: number,
  remainingCredits: number,
): TargetOutcome => {
  if (remainingCredits <= 0 || target <= 0 || target > 100) return { kind: 'incomplete' }
  const total = summary.weightedCredits + remainingCredits
  const needed = (target * total - summary.weightedSum) / remainingCredits
  if (needed <= 0) return { kind: 'already', needed }
  if (needed > 100) {
    return { kind: 'impossible', needed, best: (summary.weightedSum + 100 * remainingCredits) / total }
  }
  return { kind: 'reachable', needed }
}

export const formatAverage = (value: number): string =>
  (Math.round(value * 100) / 100).toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
