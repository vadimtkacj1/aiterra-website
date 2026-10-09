import { appendFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const home = join(root, 'seo', 'ai-visibility')
const api = 'https://api.dataforseo.com/v3'
const chatEngines = ['chat_gpt', 'perplexity', 'gemini', 'claude']

export const endpoints = {
  chat_gpt: 'ai_optimization/chat_gpt/llm_responses/live',
  perplexity: 'ai_optimization/perplexity/llm_responses/live',
  gemini: 'ai_optimization/gemini/llm_responses/live',
  claude: 'ai_optimization/claude/llm_responses/live',
  google: 'serp/google/organic/live/advanced',
}

export function llmTask(engine, panel, prompt) {
  const task = { user_prompt: prompt.prompt, model_name: panel.models[engine] }
  if (engine === 'perplexity') return { ...task, web_search_country_iso_code: panel.country }
  if (engine === 'gemini') return { ...task, web_search: true }
  return {
    ...task,
    web_search: true,
    force_web_search: true,
    web_search_country_iso_code: panel.country,
  }
}

export function serpTask(panel, prompt) {
  return { ...panel.serp, ...prompt.serp, keyword: prompt.keyword, load_async_ai_overview: true }
}

export function brandOf(panel) {
  return { regex: new RegExp(panel.brand.patterns.join('|'), 'i'), domains: panel.brand.domains }
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function isOurs(host, domains) {
  return domains.some((domain) => host === domain || host.endsWith(`.${domain}`))
}

function walk(node, visit) {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit))
  } else if (node && typeof node === 'object') {
    visit(node)
    Object.values(node).forEach((child) => walk(child, visit))
  }
}

function linksIn(node) {
  const seen = new Map()
  walk(node, (n) => {
    if (typeof n.url === 'string' && /^https?:\/\//.test(n.url) && !seen.has(n.url)) {
      seen.set(n.url, { url: n.url, domain: hostOf(n.url) })
    }
  })
  return [...seen.values()]
}

function answerIn(node) {
  const parts = []
  walk(node, (n) => {
    if (Array.isArray(n.sections)) {
      parts.push(...n.sections.map((s) => s?.text).filter((t) => typeof t === 'string'))
    }
  })
  return parts.join('\n\n')
}

function textIn(node) {
  const parts = []
  walk(node, (n) => {
    for (const key of ['text', 'title', 'markdown']) {
      if (typeof n[key] === 'string') parts.push(n[key])
    }
  })
  return parts.join('\n')
}

function citationStats(links, domains) {
  const rank = links.findIndex((link) => isOurs(link.domain, domains))
  return {
    cited: rank >= 0,
    citationRank: rank >= 0 ? rank + 1 : null,
    citedDomains: [...new Set(links.map((link) => link.domain))],
  }
}

export function analyzeLlm(result, brand) {
  const text = answerIn(result)
  const fanOut = []
  const annotations = []
  walk(result, (n) => {
    if (Array.isArray(n.fan_out_queries)) fanOut.push(...n.fan_out_queries)
    if (Array.isArray(n.annotations)) annotations.push(...n.annotations)
  })
  return {
    mentioned: brand.regex.test(text),
    ...citationStats(linksIn(annotations), brand.domains),
    fanOut,
    text,
  }
}

export function analyzeSerp(result, brand) {
  const items = result?.items ?? []
  const ours = items.find((i) => i.type === 'organic' && isOurs(hostOf(i.url), brand.domains))
  const overview = items.find((i) => i.type === 'ai_overview')
  const text = overview ? textIn(overview) : ''
  return {
    organicRank: ours?.rank_group ?? null,
    organicUrl: ours?.url ?? null,
    aiOverview: Boolean(overview),
    mentioned: brand.regex.test(text),
    ...citationStats(overview ? linksIn(overview) : [], brand.domains),
    text,
  }
}

async function post(path, task, auth) {
  const response = await fetch(`${api}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([task]),
  })
  const body = await response.json().catch(() => ({}))
  const job = body.tasks?.[0]
  if (!response.ok || job?.status_code !== 20000) {
    throw new Error(job?.status_message ?? body.status_message ?? `HTTP ${response.status}`)
  }
  return { result: job.result?.[0] ?? null, cost: job.cost ?? 0 }
}

async function listModels(auth) {
  for (const engine of chatEngines) {
    const response = await fetch(`${api}/ai_optimization/${engine}/llm_responses/models`, {
      headers: { Authorization: `Basic ${auth}` },
    })
    const body = await response.json().catch(() => ({}))
    const models = body.tasks?.[0]?.result ?? []
    console.log(`\n${engine}${models.length ? '' : '  (no model list returned)'}`)
    for (const model of models) {
      console.log(`  ${model.model_name}${model.web_search_supported ? '  [web search]' : ''}`)
    }
  }
}

async function pool(jobs, size, worker) {
  const results = []
  let next = 0
  const lane = async () => {
    while (next < jobs.length) {
      const index = next++
      results[index] = await worker(jobs[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, jobs.length) }, lane))
  return results
}

function options(argv) {
  const value = (name) => {
    const index = argv.indexOf(`--${name}`)
    return index >= 0 ? argv[index + 1] : undefined
  }
  return {
    dryRun: argv.includes('--dry-run'),
    models: argv.includes('--models'),
    engines: (value('engines') ?? Object.keys(endpoints).join(',')).split(','),
    limit: Number(value('limit') ?? Infinity),
  }
}

const columns = [
  'date',
  'engine',
  'id',
  'service',
  'mentioned',
  'cited',
  'citationRank',
  'organicRank',
  'aiOverview',
  'cost',
  'error',
]

function csvCell(value) {
  const text = value === undefined || value === null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

async function save(panel, results) {
  const now = new Date().toISOString()
  const date = now.slice(0, 10)
  await mkdir(join(home, 'runs'), { recursive: true })
  const runPath = join(home, 'runs', `${now.slice(0, 16).replace(':', '')}.json`)
  const run = { date: now, models: panel.models, serp: panel.serp, results }
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`)
  const historyPath = join(home, 'history.csv')
  const exists = await stat(historyPath).then(
    () => true,
    () => false,
  )
  const rows = results.map((r) => columns.map((c) => csvCell(c === 'date' ? date : r[c])).join(','))
  const header = exists ? '' : `${columns.join(',')}\n`
  await appendFile(historyPath, `${header}${rows.join('\n')}\n`)
  console.log(`\nsaved ${runPath}\nappended ${rows.length} rows to ${historyPath}`)
}

function percent(part, total) {
  return total ? `${Math.round((part / total) * 100)}%` : '-'
}

function report(results, domains, depth) {
  const byEngine = Object.groupBy(results, (r) => r.engine)
  console.log(`\n${'engine'.padEnd(12)}${'ok'.padEnd(6)}${'mentioned'.padEnd(12)}${'cited'.padEnd(8)}errors`)
  for (const [engine, rows] of Object.entries(byEngine)) {
    const ok = rows.filter((r) => !r.error)
    const mentioned = percent(ok.filter((r) => r.mentioned).length, ok.length)
    const cited = percent(ok.filter((r) => r.cited).length, ok.length)
    const errors = rows.length - ok.length
    console.log(
      `${engine.padEnd(12)}${String(ok.length).padEnd(6)}${mentioned.padEnd(12)}${cited.padEnd(8)}${errors}`,
    )
  }
  const serp = (byEngine.google ?? []).filter((r) => !r.error)
  if (serp.length) {
    const ranked = serp.filter((r) => r.organicRank).length
    const overviews = serp.filter((r) => r.aiOverview).length
    console.log(
      `\ngoogle: ranked in top ${depth} for ${ranked}/${serp.length} keywords, ` +
        `AI Overview shown on ${overviews}, aiterra cited in ${serp.filter((r) => r.cited).length}`,
    )
  }
  const tally = new Map()
  for (const r of results) {
    for (const domain of r.citedDomains ?? []) {
      if (!isOurs(domain, domains)) tally.set(domain, (tally.get(domain) ?? 0) + 1)
    }
  }
  const top = [...tally].sort((a, b) => b[1] - a[1]).slice(0, 12)
  if (top.length) {
    console.log('\nmost cited other domains:')
    for (const [domain, count] of top) console.log(`  ${String(count).padStart(3)}  ${domain}`)
  }
  const cost = results.reduce((sum, r) => sum + (r.cost ?? 0), 0)
  console.log(`\ntotal cost: $${cost.toFixed(4)}`)
  const failed = results.filter((r) => r.error)
  for (const r of failed.slice(0, 5)) console.log(`error ${r.engine}/${r.id}: ${r.error}`)
}

async function main() {
  const opts = options(process.argv.slice(2))
  const panel = JSON.parse(await readFile(join(home, 'prompts.json'), 'utf8'))
  const brand = brandOf(panel)
  const unknown = opts.engines.filter((engine) => !endpoints[engine])
  if (unknown.length) throw new Error(`unknown engine: ${unknown.join(', ')}`)

  const jobs = panel.prompts.slice(0, opts.limit).flatMap((prompt) =>
    opts.engines
      .filter((engine) => engine !== 'google' || prompt.keyword)
      .map((engine) => ({
        engine,
        prompt,
        task: engine === 'google' ? serpTask(panel, prompt) : llmTask(engine, panel, prompt),
      })),
  )

  if (opts.dryRun) {
    const counts = Object.entries(Object.groupBy(jobs, (job) => job.engine))
    console.log(`${jobs.length} calls: ${counts.map(([e, list]) => `${e} ${list.length}`).join(', ')}`)
    for (const engine of opts.engines) {
      const sample = jobs.find((job) => job.engine === engine)
      if (sample) console.log(`\n${engine} -> POST ${api}/${endpoints[engine]}\n${JSON.stringify([sample.task])}`)
    }
    return
  }

  const { DATAFORSEO_LOGIN: login, DATAFORSEO_PASSWORD: password } = process.env
  if (!login || !password) throw new Error('set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in .env')
  const auth = Buffer.from(`${login}:${password}`).toString('base64')

  if (opts.models) {
    await listModels(auth)
    return
  }

  console.log(`running ${jobs.length} calls`)
  const results = await pool(jobs, 4, async ({ engine, prompt, task }) => {
    const base = { engine, id: prompt.id, service: prompt.service, query: task.user_prompt ?? task.keyword }
    try {
      const { result, cost } = await post(endpoints[engine], task, auth)
      const analysis = engine === 'google' ? analyzeSerp(result, brand) : analyzeLlm(result, brand)
      process.stdout.write('.')
      return { ...base, cost, ...analysis }
    } catch (error) {
      process.stdout.write('x')
      return { ...base, cost: 0, error: error.message }
    }
  })

  await save(panel, results)
  report(results, brand.domains, panel.serp.depth)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
