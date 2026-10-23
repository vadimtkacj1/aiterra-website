import { destinations, type Destination, type Region } from '@/lib/flight-times'
import { enFormatDifference } from './time-difference-en'

export const enRegionLabels: Record<Region, string> = {
  'greece-cyprus': 'Greece and Cyprus',
  europe: 'Europe',
  caucasus: 'Caucasus',
  'middle-east': 'Gulf',
  asia: 'Asia',
  africa: 'Africa',
  'north-america': 'North America',
  'south-america': 'South America',
  oceania: 'Oceania',
}

const englishNames: Record<string, [string, string]> = {
  athens: ['Athens', 'Greece'],
  larnaca: ['Larnaca', 'Cyprus'],
  paphos: ['Paphos', 'Cyprus'],
  rhodes: ['Rhodes', 'Greece'],
  heraklion: ['Heraklion (Crete)', 'Greece'],
  thessaloniki: ['Thessaloniki', 'Greece'],
  corfu: ['Corfu', 'Greece'],
  santorini: ['Santorini', 'Greece'],
  mykonos: ['Mykonos', 'Greece'],
  rome: ['Rome', 'Italy'],
  milan: ['Milan', 'Italy'],
  venice: ['Venice', 'Italy'],
  naples: ['Naples', 'Italy'],
  paris: ['Paris', 'France'],
  london: ['London', 'United Kingdom'],
  dublin: ['Dublin', 'Ireland'],
  amsterdam: ['Amsterdam', 'Netherlands'],
  brussels: ['Brussels', 'Belgium'],
  frankfurt: ['Frankfurt', 'Germany'],
  berlin: ['Berlin', 'Germany'],
  munich: ['Munich', 'Germany'],
  vienna: ['Vienna', 'Austria'],
  zurich: ['Zurich', 'Switzerland'],
  geneva: ['Geneva', 'Switzerland'],
  madrid: ['Madrid', 'Spain'],
  barcelona: ['Barcelona', 'Spain'],
  lisbon: ['Lisbon', 'Portugal'],
  prague: ['Prague', 'Czech Republic'],
  budapest: ['Budapest', 'Hungary'],
  warsaw: ['Warsaw', 'Poland'],
  krakow: ['Kraków', 'Poland'],
  bucharest: ['Bucharest', 'Romania'],
  sofia: ['Sofia', 'Bulgaria'],
  belgrade: ['Belgrade', 'Serbia'],
  zagreb: ['Zagreb', 'Croatia'],
  podgorica: ['Podgorica', 'Montenegro'],
  tirana: ['Tirana', 'Albania'],
  malta: ['Malta', 'Malta'],
  copenhagen: ['Copenhagen', 'Denmark'],
  stockholm: ['Stockholm', 'Sweden'],
  istanbul: ['Istanbul', 'Turkey'],
  batumi: ['Batumi', 'Georgia'],
  tbilisi: ['Tbilisi', 'Georgia'],
  dubai: ['Dubai', 'United Arab Emirates'],
  'abu-dhabi': ['Abu Dhabi', 'United Arab Emirates'],
  doha: ['Doha', 'Qatar'],
  mumbai: ['Mumbai', 'India'],
  delhi: ['Delhi', 'India'],
  bangkok: ['Bangkok', 'Thailand'],
  phuket: ['Phuket', 'Thailand'],
  bali: ['Bali', 'Indonesia'],
  'ho-chi-minh': ['Ho Chi Minh City', 'Vietnam'],
  singapore: ['Singapore', 'Singapore'],
  'hong-kong': ['Hong Kong', 'Hong Kong'],
  beijing: ['Beijing', 'China'],
  seoul: ['Seoul', 'South Korea'],
  tokyo: ['Tokyo', 'Japan'],
  'addis-ababa': ['Addis Ababa', 'Ethiopia'],
  nairobi: ['Nairobi', 'Kenya'],
  johannesburg: ['Johannesburg', 'South Africa'],
  casablanca: ['Casablanca', 'Morocco'],
  'new-york': ['New York', 'United States'],
  boston: ['Boston', 'United States'],
  miami: ['Miami', 'United States'],
  chicago: ['Chicago', 'United States'],
  'los-angeles': ['Los Angeles', 'United States'],
  'san-francisco': ['San Francisco', 'United States'],
  toronto: ['Toronto', 'Canada'],
  'mexico-city': ['Mexico City', 'Mexico'],
  'sao-paulo': ['São Paulo', 'Brazil'],
  'buenos-aires': ['Buenos Aires', 'Argentina'],
  sydney: ['Sydney', 'Australia'],
}

export const enDestinations: Destination[] = destinations.map((item) => {
  const names = englishNames[item.id]
  return names ? { ...item, name: names[0], country: names[1] } : item
})

export function enDurationText(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} minutes`
  const hourPart = hours === 1 ? '1 hour' : `${hours} hours`
  if (rest === 0) return hourPart
  return `${hourPart} ${rest} minutes`
}

export function enOffsetText(item: Pick<Destination, 'winter' | 'summer'>) {
  if (item.winter === item.summer) return enFormatDifference(item.winter)
  return `${enFormatDifference(item.winter)} / ${enFormatDifference(item.summer)}`
}
