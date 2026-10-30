import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import BusinessScenario from '../../../components/tools/BusinessScenario'
import {
  businessCalculatorBySlug,
  businessCalculatorPath,
  businessCalculators,
  exampleResult,
  formatLine,
} from '@/lib/business-calculators'

export const dynamicParams = false

export const generateStaticParams = () => businessCalculators.map(({ slug }) => ({ slug }))

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const calculator = businessCalculatorBySlug((await params).slug)
  if (!calculator) return {}
  return toolMetadata({
    path: businessCalculatorPath(calculator.slug),
    metaTitle: calculator.metaTitle,
    description: calculator.description,
  })
}

export default async function BusinessCalculatorPage({ params }: Params) {
  const calculator = businessCalculatorBySlug((await params).slug)
  if (!calculator) notFound()
  const { slug, title, metaTitle, description, lede, formula, fields } = calculator
  const example = exampleResult(calculator)
  const faq: ToolFaqEntry[] = calculator.faq.map((entry, index) => ({ id: `${slug}-${index}`, ...entry }))

  return (
    <ToolLayout
      path={businessCalculatorPath(slug)}
      title={title}
      metaTitle={metaTitle}
      description={description}
      lede={example ? `${lede} בדוגמה שבמחשבון: ${example.main.label}: ${formatLine(example.main)}.` : lede}
      tool={<BusinessScenario slug={slug} />}
      faq={faq}
      cta={{
        text: 'רוצים שהמספרים יגיעו אליכם אוטומטית? אנחנו בונים מערכות ודוחות לעסקים.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>הנוסחה</h2>
      <p>{formula}</p>
      {example ? (
        <>
          <h2>דוגמה לחישוב</h2>
          <ul>
            {fields.map(({ id, label, example: value }) => (
              <li key={id}>
                {label}: {value.toLocaleString('he-IL')}
              </li>
            ))}
            {[example.main, ...example.lines].map((line) => (
              <li key={line.label}>
                <strong>{line.label}:</strong> {formatLine(line)}
              </li>
            ))}
          </ul>
          <p>{example.verdict.text}</p>
        </>
      ) : null}
      <p>התוצאה תלויה בתחזית שהזנתם, והיא אינה ייעוץ פיננסי.</p>
      <h2>עוד מחשבונים לעסק</h2>
      <ul>
        {businessCalculators
          .filter((item) => item.slug !== slug)
          .map((item) => (
            <li key={item.slug}>
              <Link href={businessCalculatorPath(item.slug)}>{item.title}</Link>
            </li>
          ))}
      </ul>
    </ToolLayout>
  )
}
