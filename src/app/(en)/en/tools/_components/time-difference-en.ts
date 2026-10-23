import { cities, type City } from '@/lib/time-difference'

const englishNames: Record<string, [string, string]> = {
  'new-york': ['New York', 'United States'],
  'los-angeles': ['Los Angeles', 'United States'],
  chicago: ['Chicago', 'United States'],
  miami: ['Miami', 'United States'],
  denver: ['Denver', 'United States'],
  phoenix: ['Phoenix', 'United States'],
  honolulu: ['Honolulu', 'United States'],
  anchorage: ['Anchorage', 'United States'],
  toronto: ['Toronto', 'Canada'],
  vancouver: ['Vancouver', 'Canada'],
  'mexico-city': ['Mexico City', 'Mexico'],
  panama: ['Panama City', 'Panama'],
  bogota: ['Bogotá', 'Colombia'],
  lima: ['Lima', 'Peru'],
  'sao-paulo': ['São Paulo', 'Brazil'],
  'buenos-aires': ['Buenos Aires', 'Argentina'],
  santiago: ['Santiago', 'Chile'],
  london: ['London', 'United Kingdom'],
  dublin: ['Dublin', 'Ireland'],
  lisbon: ['Lisbon', 'Portugal'],
  madrid: ['Madrid', 'Spain'],
  paris: ['Paris', 'France'],
  amsterdam: ['Amsterdam', 'Netherlands'],
  brussels: ['Brussels', 'Belgium'],
  berlin: ['Berlin', 'Germany'],
  zurich: ['Zurich', 'Switzerland'],
  vienna: ['Vienna', 'Austria'],
  rome: ['Rome', 'Italy'],
  prague: ['Prague', 'Czech Republic'],
  budapest: ['Budapest', 'Hungary'],
  warsaw: ['Warsaw', 'Poland'],
  stockholm: ['Stockholm', 'Sweden'],
  copenhagen: ['Copenhagen', 'Denmark'],
  athens: ['Athens', 'Greece'],
  bucharest: ['Bucharest', 'Romania'],
  sofia: ['Sofia', 'Bulgaria'],
  kyiv: ['Kyiv', 'Ukraine'],
  istanbul: ['Istanbul', 'Turkey'],
  moscow: ['Moscow', 'Russia'],
  tbilisi: ['Tbilisi', 'Georgia'],
  baku: ['Baku', 'Azerbaijan'],
  cairo: ['Cairo', 'Egypt'],
  amman: ['Amman', 'Jordan'],
  dubai: ['Dubai', 'United Arab Emirates'],
  riyadh: ['Riyadh', 'Saudi Arabia'],
  tehran: ['Tehran', 'Iran'],
  mumbai: ['Mumbai', 'India'],
  delhi: ['Delhi', 'India'],
  bangkok: ['Bangkok', 'Thailand'],
  singapore: ['Singapore', 'Singapore'],
  'hong-kong': ['Hong Kong', 'Hong Kong'],
  beijing: ['Beijing', 'China'],
  seoul: ['Seoul', 'South Korea'],
  tokyo: ['Tokyo', 'Japan'],
  manila: ['Manila', 'Philippines'],
  sydney: ['Sydney', 'Australia'],
  perth: ['Perth', 'Australia'],
  auckland: ['Auckland', 'New Zealand'],
  johannesburg: ['Johannesburg', 'South Africa'],
  nairobi: ['Nairobi', 'Kenya'],
  'addis-ababa': ['Addis Ababa', 'Ethiopia'],
  casablanca: ['Casablanca', 'Morocco'],
}

export const enCity = (city: City): City => {
  const names = englishNames[city.id]
  return names ? { ...city, name: names[0], country: names[1] } : city
}

export const enCities = cities.map(enCity)

export const enGapZones = [
  { zone: 'America/New_York', label: 'New York (United States)' },
  { zone: 'Europe/London', label: 'London (United Kingdom)' },
  { zone: 'Europe/Paris', label: 'Paris (Central Europe)' },
  { zone: 'Australia/Sydney', label: 'Sydney (Australia)' },
]

export function enFormatDifference(minutes: number) {
  if (minutes === 0) return 'Same time'
  const sign = minutes > 0 ? '+' : '−'
  const absolute = Math.abs(minutes)
  const hours = Math.floor(absolute / 60)
  const rest = absolute % 60
  const amount = rest ? `${hours}:${String(rest).padStart(2, '0')}` : String(hours)
  return `${sign}${amount} ${absolute === 60 ? 'hour' : 'hours'}`
}

export function enDescribeDifference(minutes: number) {
  if (minutes === 0) return 'Same time as Israel'
  const amount = enFormatDifference(minutes).slice(1)
  return minutes > 0 ? `${amount} ahead of Israel` : `${amount} behind Israel`
}
