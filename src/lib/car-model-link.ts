import slugs from '@/data/car-model-slugs.json'
import { carModelKey } from '@/lib/car-model-key'

const slugByKey: Record<string, string> = slugs

export function carModelPathFor(manufacturer: string, commercialName: string, year: number | null) {
  const slug = slugByKey[carModelKey(manufacturer, commercialName, year)]
  return slug ? `/cars/${slug}` : null
}
