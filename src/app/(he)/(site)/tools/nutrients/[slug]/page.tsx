import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import NutrientTable from '../../../components/tools/NutrientTable'
import { NUTRIENTS_SOURCE, foodsRichIn, nutrientBySlug, nutrientPath, nutrients } from '@/lib/nutrients'

export const dynamicParams = false

export const generateStaticParams = () => nutrients.map(({ slug }) => ({ slug }))

type Params = { params: Promise<{ slug: string }> }

const titleOf = (name: string) => `טבלת ${name} במזון: כמה ${name} יש בכל מזון ל-100 גרם`
const descriptionOf = (name: string) =>
  `כמה ${name} יש במזון: טבלה עם חיפוש לפי שם המזון, לפי מאגר התזונה הלאומי של משרד הבריאות, בכמות ל-100 גרם.`

export async function generateMetadata({ params }: Params) {
  const nutrient = nutrientBySlug((await params).slug)
  if (!nutrient) return {}
  return toolMetadata({
    path: nutrientPath(nutrient.slug),
    metaTitle: titleOf(nutrient.name),
    description: descriptionOf(nutrient.name),
  })
}

export default async function NutrientPage({ params }: Params) {
  const nutrient = nutrientBySlug((await params).slug)
  if (!nutrient) notFound()
  const { name, unit, dailyAdult, role, slug } = nutrient
  const foods = foodsRichIn(nutrient)
  const top = foods.slice(0, 3)

  const faq: ToolFaqEntry[] = [
    {
      id: `nutrient-${slug}-top`,
      question: `באילו מזונות יש הכי הרבה ${name}?`,
      answer: `לפי מאגר התזונה הלאומי, בראש הרשימה נמצאים ${top.map((food) => `${food.name} (${food.amount} ${unit})`).join(', ')}, בכמות ל-100 גרם. כדאי לזכור שמחלק מהמזונות אוכלים כמות קטנה בהרבה מ-100 גרם.`,
    },
    {
      id: `nutrient-${slug}-daily`,
      question: `כמה ${name} צריך ביום?`,
      answer: `הערכה מקובלת למבוגרים: ${dailyAdult}. הצורך משתנה לפי גיל, מין, היריון ומצב בריאותי, ולכן המלצה אישית מקבלים מרופא או מדיאטן.`,
    },
  ]

  return (
    <ToolLayout
      path={nutrientPath(slug)}
      title={`טבלת ${name} במזון`}
      metaTitle={titleOf(name)}
      description={descriptionOf(name)}
      lede={`${name}: ${role}. הטבלה מסודרת מהערך הגבוה לנמוך, ואפשר לחפש בה מזון מסוים. בראש הטבלה: ${top[0].name}, ${top[0].amount} ${unit} ל-100 גרם.`}
      tool={<NutrientTable foods={foods} name={name} unit={unit} />}
      faq={faq}
      cta={{
        text: 'צריכים מאגר נתונים עם חיפוש באתר שלכם? אנחנו בונים כלים כאלה לעסקים.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>מקור הנתונים</h2>
      <p>
        הערכים נלקחו מ
        <a href={NUTRIENTS_SOURCE} rel="noopener noreferrer" target="_blank">
          מאגר התזונה הלאומי הישראלי
        </a>{' '}
        של משרד הבריאות ב-data.gov.il. הדף נועד למידע כללי ואינו מחליף ייעוץ רפואי או תזונתי.
      </p>
      <h2>טבלאות נוספות</h2>
      <ul>
        {nutrients
          .filter((item) => item.slug !== slug)
          .map((item) => (
            <li key={item.slug}>
              <Link href={nutrientPath(item.slug)}>טבלת {item.name} במזון</Link>
            </li>
          ))}
      </ul>
    </ToolLayout>
  )
}
