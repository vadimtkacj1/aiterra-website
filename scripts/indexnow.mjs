import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const host = 'www.aiterra.co.il'
const endpoint = 'https://api.indexnow.org/indexnow'

async function readKey() {
  const key = (await readFile(join(root, 'public', 'indexnow-key.txt'), 'utf8')).trim()
  if (!/^[a-f0-9]{32}$/.test(key)) throw new Error('public/indexnow-key.txt must hold a 32-character hex key')
  return key
}

async function sitemapUrls() {
  const xml = await (await fetch(`https://${host}/sitemap.xml`)).text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

function urlsFromArgs(args) {
  return args.filter((a) => a.startsWith('http')).map((a) => (a.includes('://') ? a : `https://${host}${a}`))
}

async function main() {
  const args = process.argv.slice(2)
  const key = await readKey()
  const explicit = urlsFromArgs(args)
  const paths = args.filter((a) => a.startsWith('/')).map((p) => `https://${host}${p}`)
  const urlList = explicit.length || paths.length ? [...explicit, ...paths] : await sitemapUrls()
  const body = { host, key, keyLocation: `https://${host}/indexnow-key.txt`, urlList: urlList.slice(0, 10000) }
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })
  console.log(`IndexNow: ${urlList.length} urls, HTTP ${response.status} ${response.statusText}`)
  if (response.status >= 400) console.log(await response.text())
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
