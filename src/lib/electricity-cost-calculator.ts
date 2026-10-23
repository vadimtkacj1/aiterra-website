export const TARIFF_AGOROT_INCL_VAT = 63.52
export const TARIFF_AGOROT_EXCL_VAT = 53.83
export const TARIFF_EFFECTIVE = '2026-07-01'
export const TARIFF_EFFECTIVE_LABEL = '1.7.2026'
export const TARIFF_CHECKED = '2026-10-23'
export const TARIFF_CHECKED_LABEL = '23.10.2026'
export const VAT_RATE = 0.18

export type Appliance = { id: string; name: string; watts: number }

export const CUSTOM_ID = 'custom'

export const appliances: Appliance[] = [
  { id: 'ac-1', name: 'מזגן עילי 1 כ״ס (קירור)', watts: 800 },
  { id: 'ac-15', name: 'מזגן עילי 1.5 כ״ס (קירור)', watts: 1200 },
  { id: 'ac-2', name: 'מזגן עילי 2 כ״ס (קירור)', watts: 1700 },
  { id: 'boiler', name: 'דוד חשמלי', watts: 3000 },
  { id: 'fridge', name: 'מקרר עם מקפיא (ממוצע לאורך היממה)', watts: 50 },
  { id: 'washer', name: 'מכונת כביסה (ממוצע במחזור)', watts: 500 },
  { id: 'dryer', name: 'מייבש כביסה', watts: 2500 },
  { id: 'dishwasher', name: 'מדיח כלים (ממוצע במחזור)', watts: 1200 },
  { id: 'oven', name: 'תנור אפייה חשמלי', watts: 2000 },
  { id: 'toaster-oven', name: 'טוסטר אובן', watts: 1500 },
  { id: 'air-fryer', name: 'סיר טיגון באוויר', watts: 1500 },
  { id: 'microwave', name: 'מיקרוגל', watts: 1000 },
  { id: 'kettle', name: 'קומקום חשמלי', watts: 2000 },
  { id: 'heater', name: 'תנור חימום חשמלי', watts: 2000 },
  { id: 'vacuum', name: 'שואב אבק', watts: 1000 },
  { id: 'hair-dryer', name: 'מייבש שיער', watts: 1800 },
  { id: 'desktop', name: 'מחשב נייח עם מסך', watts: 200 },
  { id: 'laptop', name: 'מחשב נייד', watts: 50 },
  { id: 'tv', name: 'טלוויזיה (LED)', watts: 100 },
  { id: 'fan', name: 'מאוורר', watts: 50 },
  { id: 'led', name: 'נורת LED', watts: 10 },
  { id: 'charger', name: 'מטען לטלפון', watts: 10 },
]

export type Row = {
  key: number
  applianceId: string
  watts: string
  quantity: string
  hoursPerDay: string
  daysPerMonth: string
}

export function parseNumber(value: string): number {
  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export function rowKwhPerMonth(row: Row): number {
  const watts = parseNumber(row.watts)
  const quantity = parseNumber(row.quantity)
  const hours = Math.min(24, parseNumber(row.hoursPerDay))
  const days = Math.min(31, parseNumber(row.daysPerMonth))
  return (watts * quantity * hours * days) / 1000
}

export function costIls(kwh: number, agorotPerKwh: number): number {
  return (kwh * agorotPerKwh) / 100
}

export function formatIls(value: number): string {
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 2 }).format(value)
}

export function formatKwh(value: number): string {
  return new Intl.NumberFormat('he-IL', { maximumFractionDigits: 1 }).format(value)
}

export function applianceById(id: string): Appliance | undefined {
  return appliances.find((item) => item.id === id)
}

export function priceWithVat(exclVat: number): number {
  return exclVat * (1 + VAT_RATE)
}

export const electricitySources = [
  {
    label: 'TheMarker SuperMarker: תעריף החשמל 2026 (לפי ספר התעריפים של רשות החשמל, יולי 2026)',
    href: 'https://www.supermarker.themarker.com/bills/guides/electricity-tariff-2026',
  },
  {
    label: 'רשות החשמל: ספר לוחות התעריפים, יולי 2026, לוח 5.3-1 (gov.il, PDF)',
    href: 'https://www.gov.il/BlobFolder/generalpage/tarriffbook/he/sefer_tariff_07_2026.pdf',
  },
]
