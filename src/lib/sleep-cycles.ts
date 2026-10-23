export const DEFAULT_CYCLE_MINUTES = 90
export const DEFAULT_FALL_ASLEEP_MINUTES = 15
export const MIN_CYCLE_MINUTES = 70
export const MAX_CYCLE_MINUTES = 120
export const MAX_FALL_ASLEEP_MINUTES = 60
export const CYCLE_COUNTS = [6, 5, 4] as const

export const RECOMMENDED_MIN_MINUTES = 7 * 60
export const RECOMMENDED_MAX_MINUTES = 9 * 60

const DAY_MINUTES = 24 * 60

export type SleepMode = 'wake' | 'bed'

export type SleepVerdict = 'below' | 'within' | 'above'

export type SleepOption = {
  cycles: number
  time: string
  sleepMinutes: number
  verdict: SleepVerdict
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function parseTime(value: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

export function formatTime(totalMinutes: number) {
  const wrapped = ((Math.round(totalMinutes) % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES
  const hours = Math.floor(wrapped / 60)
  const minutes = wrapped % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function verdictFor(sleepMinutes: number): SleepVerdict {
  if (sleepMinutes < RECOMMENDED_MIN_MINUTES) return 'below'
  if (sleepMinutes > RECOMMENDED_MAX_MINUTES) return 'above'
  return 'within'
}

export function durationLabel(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)
  const hoursPart = hours === 1 ? 'שעה' : `${hours} שעות`
  if (minutes === 0) return hoursPart
  return `${hoursPart} ו-${minutes} דקות`
}

type Inputs = { clock: number; cycleMinutes: number; fallAsleepMinutes: number }

export function bedtimesForWake({ clock, cycleMinutes, fallAsleepMinutes }: Inputs): SleepOption[] {
  return CYCLE_COUNTS.map((cycles) => {
    const sleepMinutes = cycles * cycleMinutes
    return {
      cycles,
      time: formatTime(clock - sleepMinutes - fallAsleepMinutes),
      sleepMinutes,
      verdict: verdictFor(sleepMinutes),
    }
  })
}

export function wakeTimesForBed({ clock, cycleMinutes, fallAsleepMinutes }: Inputs): SleepOption[] {
  return [...CYCLE_COUNTS].reverse().map((cycles) => {
    const sleepMinutes = cycles * cycleMinutes
    return {
      cycles,
      time: formatTime(clock + fallAsleepMinutes + sleepMinutes),
      sleepMinutes,
      verdict: verdictFor(sleepMinutes),
    }
  })
}

export const verdictLabels: Record<SleepVerdict, string> = {
  below: 'פחות מ-7 שעות',
  within: 'בטווח 7 עד 9 שעות',
  above: 'יותר מ-9 שעות',
}
