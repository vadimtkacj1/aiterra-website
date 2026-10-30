import { resolveMx, resolveTxt } from 'node:dns/promises'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DOMAIN_PATTERN = /^(?=.{4,253}$)([a-z0-9-]{1,63}\.)+[a-z]{2,}$/
const DKIM_SELECTORS = ['google', 'default', 'selector1', 'selector2', 'k1', 'mail', 'dkim', 's1', 's2']
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000
const hits = new Map<string, number[]>()

const txtRecords = async (name: string) => {
  try {
    return (await resolveTxt(name)).map((chunks) => chunks.join(''))
  } catch {
    return []
  }
}

const hasMx = async (domain: string) => {
  try {
    return (await resolveMx(domain)).length > 0
  } catch {
    return false
  }
}

const allowed = (client: string, now: number) => {
  const recent = (hits.get(client) ?? []).filter((time) => now - time < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) return false
  if (hits.size > 5000) hits.clear()
  hits.set(client, [...recent, now])
  return true
}

const normalize = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/^.*@/, '')
    .split('/')[0]

export async function POST(request: NextRequest) {
  const client = request.headers.get('x-real-ip') ?? request.headers.get('cf-connecting-ip') ?? 'unknown'
  if (!allowed(client, Date.now())) return NextResponse.json({ ok: false }, { status: 429 })

  const body = await request.json().catch(() => null)
  const domain = normalize(body?.domain)
  if (!DOMAIN_PATTERN.test(domain)) return NextResponse.json({ ok: false }, { status: 400 })

  const [mx, root, dmarc, ...dkim] = await Promise.all([
    hasMx(domain),
    txtRecords(domain),
    txtRecords(`_dmarc.${domain}`),
    ...DKIM_SELECTORS.map((selector) => txtRecords(`${selector}._domainkey.${domain}`)),
  ])

  return NextResponse.json(
    {
      ok: true,
      report: {
        mx,
        spf: root.find((record) => /^v=spf1/i.test(record)) ?? null,
        dmarc: dmarc.find((record) => /^v=DMARC1/i.test(record)) ?? null,
        dkimSelectors: DKIM_SELECTORS.filter((_, index) => dkim[index].length > 0),
      },
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
