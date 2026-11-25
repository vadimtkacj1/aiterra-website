import type { V2ContentKey } from './content'
import type { V2Overrides } from './contentMerge'

export const CLIENT_CONTENT_KEYS = [
  'aboutPage',
  'allIn',
  'allInNodes',
  'article',
  'blog',
  'contact',
  'faq',
  'faqEntries',
  'header',
  'heroProjects',
  'heroRails',
  'heroTopics',
  'portfolio',
  'portfolioFilters',
  'portfolioItems',
  'reelItems',
  'reels',
  'reviewItems',
  'reviews',
  'serviceTabs',
  'services',
  'servicesStack',
] as const satisfies readonly V2ContentKey[]

export type ClientContentKey = (typeof CLIENT_CONTENT_KEYS)[number]

export function clientOverrides(overrides: V2Overrides): V2Overrides {
  const picked: V2Overrides = {}
  for (const key of CLIENT_CONTENT_KEYS) {
    if (key in overrides) picked[key] = overrides[key]
  }
  return picked
}
