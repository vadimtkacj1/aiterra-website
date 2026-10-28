export type Quantity = 'length' | 'area' | 'volume' | 'weight'

export type Unit = { id: string; name: string; symbol: string; quantity: Quantity; factor: number }

export const UNIT_CONVERTER_PATH = '/tools/unit-converter'

export const quantityLabels: Record<Quantity, string> = {
  length: 'אורך',
  area: 'שטח',
  volume: 'נפח',
  weight: 'משקל',
}

export const units: Unit[] = [
  { id: 'mm', name: 'מילימטר', symbol: 'מ״מ', quantity: 'length', factor: 0.001 },
  { id: 'cm', name: 'סנטימטר', symbol: 'ס״מ', quantity: 'length', factor: 0.01 },
  { id: 'm', name: 'מטר', symbol: 'מ׳', quantity: 'length', factor: 1 },
  { id: 'km', name: 'קילומטר', symbol: 'ק״מ', quantity: 'length', factor: 1000 },
  { id: 'inch', name: 'אינץ׳', symbol: 'in', quantity: 'length', factor: 0.0254 },
  { id: 'foot', name: 'רגל', symbol: 'ft', quantity: 'length', factor: 0.3048 },
  { id: 'yard', name: 'יארד', symbol: 'yd', quantity: 'length', factor: 0.9144 },
  { id: 'mile', name: 'מייל', symbol: 'mi', quantity: 'length', factor: 1609.344 },
  { id: 'sqm', name: 'מטר רבוע', symbol: 'מ״ר', quantity: 'area', factor: 1 },
  { id: 'dunam', name: 'דונם', symbol: 'דונם', quantity: 'area', factor: 1000 },
  { id: 'hectare', name: 'הקטר', symbol: 'ha', quantity: 'area', factor: 10000 },
  { id: 'sqkm', name: 'קמ״ר', symbol: 'קמ״ר', quantity: 'area', factor: 1000000 },
  { id: 'acre', name: 'אקר', symbol: 'ac', quantity: 'area', factor: 4046.8564224 },
  { id: 'sqft', name: 'רגל רבועה', symbol: 'sq ft', quantity: 'area', factor: 0.09290304 },
  { id: 'ml', name: 'מיליליטר', symbol: 'מ״ל', quantity: 'volume', factor: 0.001 },
  { id: 'liter', name: 'ליטר', symbol: 'ל׳', quantity: 'volume', factor: 1 },
  { id: 'cubic-meter', name: 'מטר מעוקב', symbol: 'מ״ק', quantity: 'volume', factor: 1000 },
  { id: 'gallon', name: 'גלון אמריקאי', symbol: 'gal', quantity: 'volume', factor: 3.785411784 },
  { id: 'uk-gallon', name: 'גלון בריטי', symbol: 'imp gal', quantity: 'volume', factor: 4.54609 },
  { id: 'fl-oz', name: 'אונקיית נוזל אמריקאית', symbol: 'fl oz', quantity: 'volume', factor: 0.0295735295625 },
  { id: 'gram', name: 'גרם', symbol: 'גר׳', quantity: 'weight', factor: 0.001 },
  { id: 'kg', name: 'קילוגרם', symbol: 'ק״ג', quantity: 'weight', factor: 1 },
  { id: 'ton', name: 'טון', symbol: 'טון', quantity: 'weight', factor: 1000 },
  { id: 'ounce', name: 'אונקיה', symbol: 'oz', quantity: 'weight', factor: 0.028349523125 },
  { id: 'troy-ounce', name: 'אונקיית טרוי (זהב)', symbol: 'ozt', quantity: 'weight', factor: 0.0311034768 },
  { id: 'pound', name: 'פאונד (ליברה)', symbol: 'lb', quantity: 'weight', factor: 0.45359237 },
]

export const unitById = (id: string) => units.find((unit) => unit.id === id)

export const unitsOf = (quantity: Quantity) => units.filter((unit) => unit.quantity === quantity)

export const convert = (value: number, from: Unit, to: Unit) => (value * from.factor) / to.factor

export const formatAmount = (value: number) =>
  new Intl.NumberFormat('he-IL', {
    maximumFractionDigits: Math.abs(value) >= 100 ? 2 : Math.abs(value) >= 1 ? 4 : 6,
  }).format(value)

export type PairPage = { slug: string; from: string; to: string; question: string; samples: number[] }

export const pairPages: PairPage[] = [
  { slug: 'dunam-to-square-meters', from: 'dunam', to: 'sqm', question: 'כמה זה דונם במטרים', samples: [0.5, 1, 2, 5, 10, 50, 100] },
  { slug: 'hectare-to-dunam', from: 'hectare', to: 'dunam', question: 'כמה דונם זה הקטר', samples: [0.5, 1, 2, 5, 10, 100] },
  { slug: 'acre-to-dunam', from: 'acre', to: 'dunam', question: 'כמה דונם זה אקר', samples: [0.5, 1, 2, 5, 10, 100] },
  { slug: 'inch-to-cm', from: 'inch', to: 'cm', question: 'כמה זה אינץ׳ בסנטימטרים', samples: [1, 5, 10, 24, 32, 43, 50, 55, 65, 75] },
  { slug: 'feet-to-meters', from: 'foot', to: 'm', question: 'כמה זה רגל במטרים', samples: [1, 3, 5, 6, 10, 100, 1000] },
  { slug: 'mile-to-km', from: 'mile', to: 'km', question: 'כמה זה מייל בקילומטרים', samples: [1, 5, 10, 26.2, 50, 100] },
  { slug: 'gallon-to-liters', from: 'gallon', to: 'liter', question: 'כמה ליטר זה גלון', samples: [0.5, 1, 2, 5, 10, 55] },
  { slug: 'ounce-to-grams', from: 'ounce', to: 'gram', question: 'כמה גרם זה אונקיה', samples: [0.5, 1, 2, 4, 8, 12, 16] },
  { slug: 'troy-ounce-to-grams', from: 'troy-ounce', to: 'gram', question: 'כמה גרם זה אונקיית זהב', samples: [0.1, 0.25, 0.5, 1, 5, 10] },
  { slug: 'pound-to-kg', from: 'pound', to: 'kg', question: 'כמה קילו זה פאונד', samples: [1, 5, 10, 50, 100, 150, 200] },
  { slug: 'fl-oz-to-ml', from: 'fl-oz', to: 'ml', question: 'כמה מ״ל זה אונקיית נוזל', samples: [1, 2, 4, 8, 12, 16, 32] },
]

export const pairPath = (slug: string) => `/tools/convert/${slug}`

export const pairPage = (slug: string) => pairPages.find((page) => page.slug === slug)
