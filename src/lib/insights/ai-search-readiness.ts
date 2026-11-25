import data from './ai-search-readiness.json'

export type ReadinessCounts = (typeof data)['business']

export const readiness = data

export const READINESS_PUBLISHED = '2026-11-09'

export const percent = (part: number, total: number) =>
  total ? `${(Math.round((1000 * part) / total) / 10).toLocaleString('he-IL')}%` : '0%'

export const count = (value: number) => value.toLocaleString('he-IL')

export const PLATFORM_ORDER = ['WordPress', 'Wix', 'Shopify', 'Next.js', 'Webflow', 'אחר / לא זוהה'] as const

export const AGENT_ROWS = [
  { id: 'gptbot', name: 'GPTBot', owner: 'OpenAI', purpose: 'אימון מודלים' },
  { id: 'oai-searchbot', name: 'OAI-SearchBot', owner: 'OpenAI', purpose: 'החיפוש של ChatGPT' },
  { id: 'chatgpt-user', name: 'ChatGPT-User', owner: 'OpenAI', purpose: 'גלישה בזמן שיחה' },
  { id: 'claudebot', name: 'ClaudeBot', owner: 'Anthropic', purpose: 'אימון מודלים' },
  { id: 'perplexitybot', name: 'PerplexityBot', owner: 'Perplexity', purpose: 'חיפוש ותשובות' },
  { id: 'google-extended', name: 'Google-Extended', owner: 'Google', purpose: 'אימון Gemini' },
  { id: 'ccbot', name: 'CCBot', owner: 'Common Crawl', purpose: 'ארכיון פתוח לאימון' },
  { id: 'bytespider', name: 'Bytespider', owner: 'ByteDance', purpose: 'אימון מודלים' },
  { id: 'applebot-extended', name: 'Applebot-Extended', owner: 'Apple', purpose: 'אימון מודלים' },
] as const

export function readinessCsv() {
  const header = ['group', 'sites', 'robots_txt', 'blocks_any_ai_bot', 'blocks_gptbot', 'blocks_oai_searchbot', 'cloudflare_managed_block', 'llms_txt', 'jsonld', 'organization_schema', 'faqpage_schema', 'no_meta_description', 'no_h1']
  const line = (group: string, c: ReadinessCounts) =>
    [group, c.total, c.robots, c.blocksAny, c.blocksGptbot, c.blocksOaiSearch, c.cloudflareManagedBlock, c.llms, c.jsonld, c.organization, c.faqPage, c.noDescription, c.noH1].join(',')
  return [
    header.join(','),
    line('all .co.il', data.business),
    ...PLATFORM_ORDER.map((name) => line(name === 'אחר / לא זוהה' ? 'other' : name, data.byPlatform[name])),
  ].join('\n')
}
