export const PSY_MIN = 200
export const PSY_MAX = 800
export const PSY_DIVISOR = 8
export const BAGRUT_MAX = 130
export const MAX_SUBJECTS = 20
export const PSY_REVIEWED = '2026-10-23'

export type Subject = {
  id: number
  units: string
  grade: string
  bonus: string
}

export const parseNumber = (value: string): number | null => {
  const clean = value.trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(clean)) return null
  const parsed = Number(clean)
  return Number.isFinite(parsed) ? parsed : null
}

export const psychometricError = (value: string): string => {
  if (!value.trim()) return ''
  const parsed = parseNumber(value)
  if (parsed === null) return 'הקלידו מספר שלם, למשל 650.'
  if (parsed < PSY_MIN || parsed > PSY_MAX) return `ציון פסיכומטרי הוא בין ${PSY_MIN} ל-${PSY_MAX}.`
  return ''
}

export const bagrutError = (value: string): string => {
  if (!value.trim()) return ''
  const parsed = parseNumber(value)
  if (parsed === null) return 'הקלידו ממוצע כמספר, למשל 98.5.'
  if (parsed > BAGRUT_MAX) return `ממוצע בגרות (כולל בונוס) הוא עד ${BAGRUT_MAX}.`
  return ''
}

export const weightError = (value: string): string => {
  if (!value.trim()) return ''
  const parsed = parseNumber(value)
  if (parsed === null || parsed > 100) return 'משקל הוא מספר בין 0 ל-100.'
  return ''
}

export const subjectError = (subject: Subject): string => {
  const units = parseNumber(subject.units)
  const grade = parseNumber(subject.grade)
  const bonus = subject.bonus.trim() ? parseNumber(subject.bonus) : 0
  if (subject.units.trim() && (units === null || units <= 0 || units > 10)) return 'יחידות לימוד: מספר בין 1 ל-10.'
  if (subject.grade.trim() && (grade === null || grade > 100)) return 'ציון הוא מספר בין 0 ל-100.'
  if (bonus === null || bonus > 30) return 'בונוס: מספר בין 0 ל-30.'
  return ''
}

export const bagrutAverage = (subjects: Subject[]): { average: number; units: number } | null => {
  let units = 0
  let sum = 0
  for (const subject of subjects) {
    if (subjectError(subject)) continue
    const subjectUnits = parseNumber(subject.units)
    const grade = parseNumber(subject.grade)
    const bonus = subject.bonus.trim() ? parseNumber(subject.bonus) : 0
    if (subjectUnits === null || grade === null || bonus === null) continue
    units += subjectUnits
    sum += subjectUnits * (grade + bonus)
  }
  return units > 0 ? { average: sum / units, units } : null
}

export type Combined = { score100: number; score800: number }

export const combine = (psychometric: number, bagrut: number, psychometricWeight: number): Combined => {
  const weight = psychometricWeight / 100
  const score100 = weight * (psychometric / PSY_DIVISOR) + (1 - weight) * bagrut
  return { score100, score800: score100 * PSY_DIVISOR }
}

export type NeededOutcome =
  | { kind: 'incomplete' }
  | { kind: 'bagrutOnly' }
  | { kind: 'already'; needed: number }
  | { kind: 'reachable'; needed: number }
  | { kind: 'impossible'; needed: number }

export const neededPsychometric = (
  target100: number,
  bagrut: number,
  psychometricWeight: number,
): NeededOutcome => {
  if (target100 <= 0) return { kind: 'incomplete' }
  if (psychometricWeight <= 0) return { kind: 'bagrutOnly' }
  const weight = psychometricWeight / 100
  const needed = ((target100 - (1 - weight) * bagrut) / weight) * PSY_DIVISOR
  if (needed <= PSY_MIN) return { kind: 'already', needed }
  if (needed > PSY_MAX) return { kind: 'impossible', needed }
  return { kind: 'reachable', needed }
}

export const formatScore = (value: number, digits = 1): string =>
  (Math.round(value * 10 ** digits) / 10 ** digits).toLocaleString('he-IL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
