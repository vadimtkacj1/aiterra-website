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
