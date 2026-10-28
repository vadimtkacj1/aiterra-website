import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import UnitConverter from '../../../components/tools/UnitConverter'
import {
  UNIT_CONVERTER_PATH,
  convert,
  formatAmount,
  pairPage,
  pairPages,
  pairPath,
  unitById,
} from '@/lib/unit-converter'

export const dynamicParams = false

export const generateStaticParams = () => pairPages.map((page) => ({ pair: page.slug }))

type Params = { params: Promise<{ pair: string }> }

function describe(slug: string) {
  const page = pairPage(slug)
  const from = page && unitById(page.from)
  const to = page && unitById(page.to)
  if (!page || !from || !to) return null
  const one = formatAmount(convert(1, from, to))
  const back = formatAmount(convert(1, to, from))
  const title = `${page.question}? ממיר ${from.name} ל${to.name}`
  const description = `1 ${from.name} = ${one} ${to.name}. ממיר ${from.name} ל${to.name} ובחזרה, עם טבלת המרה לערכים נפוצים.`
  return { page, from, to, one, back, title, description }
}

export async function generateMetadata({ params }: Params) {
  const info = describe((await params).pair)
  if (!info) return {}
  return toolMetadata({ path: pairPath(info.page.slug), metaTitle: info.title, description: info.description })
}

export default async function PairPage({ params }: Params) {
  const info = describe((await params).pair)
  if (!info) notFound()
  const { page, from, to, one, back, title, description } = info

  const faq: ToolFaqEntry[] = [
    {
      id: `convert-${page.slug}-one`,
      question: `${page.question}?`,
      answer: `${from.name} אחד שווה ${one} ${to.name}. כדי להמיר ${from.name} ל${to.name} מכפילים ב-${one}, וכדי להמיר בחזרה מכפילים ב-${back}. למשל, ${formatAmount(page.samples[2] ?? 2)} ${from.name} הם ${formatAmount(convert(page.samples[2] ?? 2, from, to))} ${to.name}.`,
    },
    {
      id: `convert-${page.slug}-back`,
      question: `כמה ${from.name} זה ${to.name} אחד?`,
      answer: `${to.name} אחד שווה ${back} ${from.name}. בממיר למעלה אפשר ללחוץ על ״החלפת כיוון״ ולהקליד כל כמות.`,
    },
  ]

  return (
    <ToolLayout
      path={pairPath(page.slug)}
      title={`${page.question}?`}
      metaTitle={title}
      description={description}
      lede={`1 ${from.name} = ${one} ${to.name}. מקלידים כמות בממיר ומקבלים את התוצאה מיד, או מסתכלים בטבלה למטה.`}
      chips={[`1 ${from.symbol} = ${one} ${to.symbol}`, 'המרה בשני הכיוונים']}
      tool={<UnitConverter from={from.id} to={to.id} />}
      faq={faq}
      cta={{
        text: 'צריכים מחשבון כזה באתר שלכם, עם המוצרים והמידות שלכם? אנחנו בונים כלים ומחשבונים לאתרים של עסקים.',
        label: 'בניית אתרים',
        href: '/services/brochure',
      }}
    >
      <h2>
        טבלת המרה: {from.name} ל{to.name}
      </h2>
      <table>
        <thead>
          <tr>
            <th scope="col">{from.name}</th>
            <th scope="col">{to.name}</th>
          </tr>
        </thead>
        <tbody>
          {page.samples.map((sample) => (
            <tr key={sample}>
              <td>{formatAmount(sample)}</td>
              <td>{formatAmount(convert(sample, from, to))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>המרות נוספות</h2>
      <ul>
        <li>
          <Link href={UNIT_CONVERTER_PATH}>ממיר יחידות מלא: אורך, שטח, נפח ומשקל</Link>
        </li>
        {pairPages
          .filter((other) => other.slug !== page.slug)
          .map((other) => (
            <li key={other.slug}>
              <Link href={pairPath(other.slug)}>{other.question}</Link>
            </li>
          ))}
      </ul>
    </ToolLayout>
  )
}
