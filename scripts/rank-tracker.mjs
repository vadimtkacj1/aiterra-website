import { createSign } from 'node:crypto'
import { appendFile, mkdir, readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const home = join(root, 'seo', 'rank-tracker')
const keywordsFile = join(home, 'keywords.txt')
const historyFile = join(home, 'history.csv')
const property = process.env.GSC_PROPERTY || 'sc-domain:aiterra.co.il'
const serviceAccountFile = process.env.GSC_SERVICE_ACCOUNT_FILE
const lagDays = 3
const windowDays = 7

const base64url = (input) =>
  Buffer.from(input).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')

function isoDate(daysAgo) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - daysAgo)
  return date.toISOString().slice(0, 10)
}

async function readKeywords() {
  const text = await readFile(keywordsFile, 'utf8')
  return [...new Set(text.replace(/^﻿/, '').split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#')))]
}

async function readServiceAccount() {
  if (!serviceAccountFile) {
    throw new Error(
      'set GSC_SERVICE_ACCOUNT_FILE to the path of a Google service-account JSON whose client_email was added to the Search Console property as a user',
    )
  }
  return JSON.parse(await readFile(serviceAccountFile, 'utf8'))
}

function signedJwt(account) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  )
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${claims}`)
  return `${header}.${claims}.${base64url(signer.sign(account.private_key))}`
}

async function accessToken(account) {
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: signedJwt(account),
  })
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body })
  if (!response.ok) throw new Error(`token request failed: ${response.status} ${await response.text()}`)
  return (await response.json()).access_token
}

async function searchAnalytics(token, startDate, endDate) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`
  const rows = []
  for (let startRow = 0; ; startRow += 25000) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate, dimensions: ['query', 'page'], rowLimit: 25000, startRow }),
    })
    if (!response.ok) throw new Error(`search analytics failed: ${response.status} ${await response.text()}`)
    const page = (await response.json()).rows ?? []
    rows.push(...page)
    if (page.length < 25000) return rows
  }
}

function summarise(rows, keyword) {
  const matching = rows.filter((row) => row.keys[0].toLowerCase() === keyword.toLowerCase())
  if (!matching.length) return { impressions: 0, clicks: 0, position: null, page: '' }
  const impressions = matching.reduce((sum, row) => sum + row.impressions, 0)
  const clicks = matching.reduce((sum, row) => sum + row.clicks, 0)
  const position = matching.reduce((sum, row) => sum + row.position * row.impressions, 0) / impressions
  const best = [...matching].sort((a, b) => b.impressions - a.impressions)[0]
  return { impressions, clicks, position: Number(position.toFixed(1)), page: best.keys[1].replace(/^https?:\/\/[^/]+/, '') }
}

async function previousRun() {
  try {
    await stat(historyFile)
  } catch {
    return new Map()
  }
  const lines = (await readFile(historyFile, 'utf8')).trim().split(/\r?\n/).slice(1)
  const latest = new Map()
  for (const line of lines) {
    const [, , keyword, , , position] = parseCsv(line)
    latest.set(keyword, position === '' ? null : Number(position))
  }
  return latest
}

function parseCsv(line) {
  const cells = []
  let cell = ''
  let quoted = false
  for (const char of line) {
    if (char === '"') quoted = !quoted
    else if (char === ',' && !quoted) {
      cells.push(cell)
      cell = ''
    } else cell += char
  }
  cells.push(cell)
  return cells
}

const csvCell = (value) => (/[",\n]/.test(String(value)) ? `"${String(value).replace(/"/g, '""')}"` : String(value))

async function appendHistory(runDate, period, results) {
  await mkdir(home, { recursive: true })
  let header = ''
  try {
    await stat(historyFile)
  } catch {
    header = 'run,period,keyword,impressions,clicks,position,page\n'
  }
  const lines = results.map(({ keyword, impressions, clicks, position, page }) =>
    [runDate, period, keyword, impressions, clicks, position ?? '', page].map(csvCell).join(','),
  )
  await appendFile(historyFile, `${header}${lines.join('\n')}\n`)
}

function printTable(results, previous, period) {
  const width = Math.max(...results.map((r) => r.keyword.length), 8)
  console.log(`Search Console, ${property}, ${period} (average position over all devices and places)`)
  console.log(`${'keyword'.padEnd(width)}  impr  clicks  position  change  page`)
  for (const result of results) {
    const before = previous.get(result.keyword)
    const change =
      result.position === null || before === null || before === undefined ? '' : (before - result.position).toFixed(1)
    const position = result.position === null ? 'none' : String(result.position)
    console.log(
      `${result.keyword.padEnd(width)}  ${String(result.impressions).padStart(4)}  ${String(result.clicks).padStart(6)}  ${position.padStart(8)}  ${change.padStart(6)}  ${result.page}`,
    )
  }
}

async function main() {
  const keywords = await readKeywords()
  const account = await readServiceAccount()
  const token = await accessToken(account)
  const endDate = isoDate(lagDays)
  const startDate = isoDate(lagDays + windowDays - 1)
  const period = `${startDate}..${endDate}`
  const rows = await searchAnalytics(token, startDate, endDate)
  const previous = await previousRun()
  const results = keywords.map((keyword) => ({ keyword, ...summarise(rows, keyword) }))
  printTable(results, previous, period)
  await appendHistory(isoDate(0), period, results)
  console.log(`\n${results.length} keywords written to ${historyFile}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
