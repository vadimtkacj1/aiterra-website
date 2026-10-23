import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import { notFound } from 'next/navigation'
import VatCalculator from '../../(he)/(site)/components/tools/VatCalculator'
import PercentageCalculator from '../../(he)/(site)/components/tools/PercentageCalculator'
import LoanCalculator from '../../(he)/(site)/components/tools/LoanCalculator'
import MinimumWageCalculator from '../../(he)/(site)/components/tools/MinimumWageCalculator'
import HebrewDateConverter from '../../(he)/(site)/components/tools/HebrewDateConverter'
import DaysBetweenCalculator from '../../(he)/(site)/components/tools/DaysBetweenCalculator'
import WorkDaysCalculator from '../../(he)/(site)/components/tools/WorkDaysCalculator'
import CpiIndexationCalculator from '../../(he)/(site)/components/tools/CpiIndexationCalculator'
import AmountInWords from '../../(he)/(site)/components/tools/AmountInWords'
import WordCounter from '../../(he)/(site)/components/tools/WordCounter'
import { EMBEDDABLE_TOOLS, TOOLS_HUB_PATH, tools } from '@/lib/tools'
import { SITE_URL } from '@/lib/seo'
import styles from './page.module.css'

const components: Record<string, ComponentType> = {
  'vat-calculator': VatCalculator,
  'percentage-calculator': PercentageCalculator,
  'loan-calculator': LoanCalculator,
  'minimum-wage-2026': MinimumWageCalculator,
  'hebrew-date-converter': HebrewDateConverter,
  'days-between-dates': DaysBetweenCalculator,
  'work-days-calculator': WorkDaysCalculator,
  'cpi-indexation-calculator': CpiIndexationCalculator,
  'amount-in-words': AmountInWords,
  'word-counter': WordCounter,
}

type EmbedParams = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return EMBEDDABLE_TOOLS.map(({ slug }) => ({ slug }))
}

const toolFor = (slug: string) => tools.find((tool) => tool.path === `${TOOLS_HUB_PATH}/${slug}`)

export async function generateMetadata({ params }: EmbedParams): Promise<Metadata> {
  const { slug } = await params
  const tool = toolFor(slug)
  if (!tool) return {}
  return {
    title: `${tool.title} | Aiterra`,
    description: tool.description,
    alternates: { canonical: tool.path },
    robots: { index: false, follow: true },
  }
}

export default async function EmbedPage({ params }: EmbedParams) {
  const { slug } = await params
  const Tool = components[slug]
  const tool = toolFor(slug)
  if (!Tool || !tool) notFound()

  return (
    <div className={`v2Root ${styles.page}`}>
      <main className={styles.main}>
        <h1 className={styles.srOnly}>{tool.title}</h1>
        <Tool />
      </main>
      <footer className={styles.footer}>
        <a href={`${SITE_URL}${tool.path}`} target="_top" className={styles.credit}>
          מחשבון חינמי מאת Aiterra
        </a>
      </footer>
    </div>
  )
}
