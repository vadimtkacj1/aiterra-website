import { NextResponse, type NextRequest } from 'next/server'
import { FETCH_SPAN_DAYS, MIN_DATE, ratesUrl } from '@/lib/exchange-rate'

export const runtime = 'nodejs'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const DAY_MS = 86_400_000
const MAX_SPAN_DAYS = FETCH_SPAN_DAYS + 7
const UPSTREAM_TIMEOUT_MS = 10_000
const CACHE_SECONDS = 3600

const dayNumber = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / DAY_MS

function validRange(start: string | null, end: string | null): { start: string; end: string } | null {
  if (!start || !end || !ISO_DATE.test(start) || !ISO_DATE.test(end)) return null
  const from = dayNumber(start)
  const to = dayNumber(end)
  if (Number.isNaN(from) || Number.isNaN(to) || start < MIN_DATE || from > to) return null
  if (to - from > MAX_SPAN_DAYS || to > Date.now() / DAY_MS + 2) return null
  return { start, end }
}

export async function GET(request: NextRequest) {
  const range = validRange(request.nextUrl.searchParams.get('start'), request.nextUrl.searchParams.get('end'))
  if (!range) return NextResponse.json({ error: 'range' }, { status: 400 })

  try {
    const upstream = await fetch(ratesUrl(range.start, range.end), {
      headers: { Accept: 'text/csv' },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      next: { revalidate: CACHE_SECONDS },
    })
    const body = await upstream.text()
    if (!upstream.ok || body.trimStart().startsWith('<')) {
      return NextResponse.json({ error: 'upstream' }, { status: 502 })
    }
    return new NextResponse(body, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': `public, max-age=600, s-maxage=${CACHE_SECONDS}`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'upstream' }, { status: 502 })
  }
}
