import type { PortfolioProject } from '@/types'

type Locale = 'he' | 'en'

const clientName = (project: PortfolioProject) => project.title.split('—')[0].trim()

const whatWasBuilt = (project: PortfolioProject) => project.projectType || project.category

export function projectMetaTitle(project: PortfolioProject, locale: Locale) {
  const suffix = locale === 'en' ? 'AITERRA project' : 'פרויקט של AITERRA'
  const client = clientName(project)
  const what = whatWasBuilt(project)
  const named = project.title.includes('—') ? project.title : `${client} — ${what}`
  return `${named} | ${suffix}`
}

export function projectSummary(project: PortfolioProject, locale: Locale) {
  const client = clientName(project)
  const what = whatWasBuilt(project)
  const tech = project.technology || project.tags.slice(0, 3).join(' · ')
  const live = project.liveSiteUrl || project.externalUrl
  if (locale === 'en') {
    const parts = [`An Aiterra project for ${client}: ${what.toLowerCase()}.`]
    if (tech) parts.push(`Stack: ${tech}.`)
    if (project.launchedAt) parts.push(`Launched: ${project.launchedAt}.`)
    if (live) parts.push(`Live site: ${live.replace(/^https?:\/\//, '').replace(/\/$/, '')}.`)
    return parts.join(' ')
  }
  const parts = [`פרויקט של Aiterra עבור ${client}: ${what}.`]
  if (tech) parts.push(`טכנולוגיה: ${tech}.`)
  if (project.launchedAt) parts.push(`הושק: ${project.launchedAt}.`)
  if (live) parts.push(`אתר חי: ${live.replace(/^https?:\/\//, '').replace(/\/$/, '')}.`)
  return parts.join(' ')
}

export type ProjectFaqEntry = { question: string; answer: string }

const MIN_ANSWER_LENGTH = 40
const HEBREW = /[\u0590-\u05FF]/

const plain = (text?: string) => (text ?? '').replace(/<[^>]+>/g, ' ').replace(/[*_#]/g, '').replace(/\s+/g, ' ').trim()

export function projectFaq(project: PortfolioProject, locale: Locale): ProjectFaqEntry[] {
  const client = clientName(project)
  const tech = project.technology || project.tags.join(', ')
  const entries =
    locale === 'en'
      ? [
          { question: `What did Aiterra build for ${client}?`, answer: plain(project.heroDescription) },
          { question: `What was the challenge in the ${client} project?`, answer: plain(project.challenge?.text) },
          { question: `How was it solved?`, answer: plain(project.solution?.text) },
          { question: `Which technology does the project use?`, answer: `The ${client} project uses ${tech}, and it is a ${whatWasBuilt(project).toLowerCase()} delivered by Aiterra.` },
        ]
      : [
          { question: `מה Aiterra בנתה עבור ${client}?`, answer: plain(project.heroDescription) },
          { question: `מה היה האתגר בפרויקט של ${client}?`, answer: plain(project.challenge?.text) },
          { question: 'איך הבעיה נפתרה?', answer: plain(project.solution?.text) },
          { question: 'באיזו טכנולוגיה נבנה הפרויקט?', answer: `הפרויקט של ${client} נבנה עם ${tech}. סוג הפרויקט: ${whatWasBuilt(project)}.` },
        ]
  return entries.filter(
    ({ answer }) => answer.length >= MIN_ANSWER_LENGTH && (locale === 'he' || !HEBREW.test(answer)),
  )
}
