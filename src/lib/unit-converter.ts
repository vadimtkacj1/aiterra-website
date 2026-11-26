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

export type PairPage = {
  slug: string
  from: string
  to: string
  question: string
  samples: number[]
  converterName?: string
  lead?: string
  more?: string
}

export const pairPages: PairPage[] = [
  { slug: 'dunam-to-square-meters', from: 'dunam', to: 'sqm', question: 'כמה זה דונם במטרים', samples: [0.5, 1, 2, 5, 10, 50, 100], lead: 'זה הדונם המטרי, שבשימוש בישראל מאז 1928.', more: 'עד 1928, בתקופה העות׳מאנית ובשנים הראשונות של המנדט, דונם היה 919.3 מ״ר, ולכן בנסחים ובמסמכי קרקע ישנים מאוד השטח יכול להיות קטן בכ-8% ממה שנראה. להמחשה: מגרש כדורגל בגודל 105 על 68 מטר הוא 7,140 מ״ר, כלומר כ-7.1 דונם.' },
  { slug: 'hectare-to-dunam', from: 'hectare', to: 'dunam', question: 'כמה דונם זה הקטר', samples: [0.5, 1, 2, 5, 10, 100], lead: 'הקטר הוא ריבוע של 100 על 100 מטר.', more: 'בישראל מודדים קרקע חקלאית ומגרשים בדונמים, אבל בסטטיסטיקה של האיחוד האירופי, במכרזים בינלאומיים ובמחקרים על יערות וחקלאות השטח מופיע בהקטרים. כדי לעבור לדונם מכפילים ב-10, וכדי לעבור לקמ״ר מחלקים ב-100.' },
  { slug: 'acre-to-dunam', from: 'acre', to: 'dunam', question: 'כמה דונם זה אקר', samples: [0.5, 1, 2, 5, 10, 100], lead: 'אקר הוא 4,046.86 מ״ר, קצת יותר מארבעה דונם.', more: 'באקרים מודדים קרקע בארצות הברית ובבריטניה, ולכן המידה מופיעה במודעות נדל״ן משם ובחדשות על חוות ושריפות יער. מייל רבוע הוא בדיוק 640 אקר. אקר אחד הוא כ-43,560 רגל רבועה, היחידה שבה מפרסמים שם גודל של דירות ובתים.' },
  { slug: 'inch-to-cm', from: 'inch', to: 'cm', question: 'כמה זה אינץ׳ בסנטימטרים', samples: [1, 5, 10, 24, 32, 43, 50, 55, 65, 75], lead: 'אינץ׳ הוא בדיוק 2.54 ס״מ.', more: 'גודל של מסך טלוויזיה, מחשב וטלפון נמדד באינץ׳ לאורך האלכסון, לא לרוחב. טלוויזיה של 55 אינץ׳ היא 139.7 ס״מ באלכסון, וטלוויזיה של 65 אינץ׳ היא 165.1 ס״מ. גם צמיגים, חישוקים וצינורות אינסטלציה נמדדים באינץ׳.' },
  { slug: 'feet-to-meters', from: 'foot', to: 'm', question: 'כמה זה רגל במטרים', samples: [1, 3, 5, 6, 10, 100, 1000], lead: 'רגל היא בדיוק 30.48 ס״מ, ו-12 אינץ׳.', more: 'בתעופה מודדים גובה ברגל גם בישראל: מטוס נוסעים ששט ב-35,000 רגל נמצא כ-10.7 ק״מ מעל הים. בארצות הברית גם גובה של אנשים מופיע ברגל ובאינץ׳, למשל 5 רגל ו-10 אינץ׳ הם כ-1.78 מטר.' },
  { slug: 'mile-to-km', from: 'mile', to: 'km', question: 'כמה זה מייל בקילומטרים', samples: [1, 5, 10, 26.2, 50, 100], lead: 'מייל הוא בדיוק 1,609.344 מטר, כלומר כמעט ק״מ ושישית.', more: 'מרתון, 42.195 ק״מ, הוא כ-26.2 מייל, ולכן הערך מופיע בטבלה. בים ובאוויר משתמשים במייל ימי, שהוא 1,852 מטר, ארוך בכ-15% מהמייל הרגיל. מהירות של 60 מייל לשעה, הנפוצה בכבישים בארצות הברית, היא כ-97 קמ״ש.' },
  { slug: 'gallon-to-liters', from: 'gallon', to: 'liter', question: 'כמה ליטר זה גלון', samples: [0.5, 1, 2, 5, 10, 55], lead: 'מדובר בגלון האמריקאי, 3.785 ליטר.', more: 'הגלון הבריטי גדול ממנו בכ-20% והוא 4.546 ליטר, אז כדאי לבדוק מאיזו מדינה המקור. חבית נפט, שבה נקבע מחיר הנפט בעולם, היא 42 גלון אמריקאי, כלומר כ-159 ליטר. חבית תעשייתית סטנדרטית היא 55 גלון, כ-208 ליטר.' },
  { slug: 'ounce-to-grams', from: 'ounce', to: 'gram', question: 'כמה גרם זה אונקיה', samples: [0.5, 1, 2, 4, 8, 12, 16], lead: 'אונקיה רגילה היא 28.35 גרם, ו-16 אונקיות הן פאונד אחד.', more: 'זו האונקיה של מתכונים ושל אריזות מזון מחו״ל. לזהב ולכסף יש אונקיה אחרת, אונקיית טרוי, שכבדה ממנה בכ-10% ושוקלת 31.1 גרם. על תוויות תזונה בארצות הברית מעגלים אונקיה ל-28 גרם, כך שבמתכון של 8 אונקיות מדובר בכ-227 גרם.' },
  { slug: 'troy-ounce-to-grams', from: 'troy-ounce', to: 'gram', question: 'כמה גרם זה אונקיית זהב', samples: [0.1, 0.25, 0.5, 1, 5, 10], converterName: 'ממיר אונקיית טרוי לגרם', lead: 'אונקיית טרוי היא 31.1035 גרם בדיוק.', more: 'במידה הזאת נקבע מחיר הזהב, הכסף והפלטינה בבורסות, ולכן כשכתוב שזהב עולה סכום מסוים ״לאונקיה״ הכוונה לאונקיית טרוי. היא כבדה בכ-10% מאונקיה רגילה של 28.35 גרם. בקילו זהב יש כ-32.15 אונקיות טרוי.' },
  { slug: 'pound-to-kg', from: 'pound', to: 'kg', question: 'כמה קילו זה פאונד', samples: [1, 5, 10, 50, 100, 150, 200], lead: 'פאונד הוא בדיוק 0.45359237 ק״ג, כלומר קצת פחות מחצי קילו.', more: 'בארצות הברית ובבריטניה משקל גוף, משקולות בחדר כושר ומטען בטיסות מופיעים בפאונד. בבריטניה משתמשים גם ב״סטון״ למשקל גוף: סטון אחד הוא 14 פאונד, כ-6.35 ק״ג. פאונד הוא 16 אונקיות.' },
  { slug: 'fl-oz-to-ml', from: 'fl-oz', to: 'ml', question: 'כמה מ״ל זה אונקיית נוזל', samples: [1, 2, 4, 8, 12, 16, 32], converterName: 'ממיר אונקיה אמריקאית למ״ל', lead: 'אונקיית נוזל אמריקאית היא 29.57 מ״ל.', more: 'על תוויות תזונה בארצות הברית מעגלים אותה ל-30 מ״ל, ולכן על אותו בקבוק אפשר לראות שני מספרים קצת שונים. פחית שתייה אמריקאית של 12 אונקיות היא כ-355 מ״ל. האונקיה הבריטית קטנה יותר, 28.41 מ״ל.' },
]

export const pairPath = (slug: string) => `/tools/convert/${slug}`

export const pairPage = (slug: string) => pairPages.find((page) => page.slug === slug)
