import type { NoticeLength } from '@/lib/notice-period'

const MS_PER_DAY = 86_400_000

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const longDateFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const wholeFormat = new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 })
const exactFormat = new Intl.NumberFormat('en-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const INVALID_MESSAGE = 'Fix the field marked with an error to see the result.'
export const COPY_FAILED = 'Copying failed. Select the result and copy it by hand.'

export const enDate = (day: number) => dateFormat.format(new Date(day * MS_PER_DAY))
export const enLongDate = (day: number) => longDateFormat.format(new Date(day * MS_PER_DAY))
export const ils = (amount: number) => wholeFormat.format(Math.round(amount))
export const ilsFromAgorot = (agorot: number) => exactFormat.format(agorot / 100)

const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? '' : 's'}`

export const enTenure = (months: number, extraDays = 0) => {
  const parts = [
    months >= 12 ? plural(Math.floor(months / 12), 'year') : '',
    months % 12 ? plural(months % 12, 'month') : '',
    extraDays > 0 ? plural(extraDays, 'day') : '',
  ].filter(Boolean)
  return parts.length ? parts.join(', ') : 'less than a month'
}

export const enNoticeLength = (length: NoticeLength) => {
  if (length.kind === 'month') return '1 month'
  return length.hundredths === 100 ? '1 day' : `${length.hundredths / 100} days`
}

export const rentalTrackName = { exemption: 'Exemption track', flat: '10% track', regular: 'Regular track' } as const
