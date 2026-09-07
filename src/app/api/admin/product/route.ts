import { NextRequest, NextResponse } from 'next/server'

function isAuthed(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session')?.value
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? 'admin123').toString('base64')
  return Boolean(session) && session === expected
}

export const dynamic = 'force-dynamic'

const MIN_DAYS = 1
const MAX_DAYS = 180

function upstreamUrl(req: NextRequest, base: string): string {
  const url = new URL(base.replace(/\/+$/, '') + '/v1/admin/product')
  const asked = Number(req.nextUrl.searchParams.get('days'))
  const days = Number.isFinite(asked) ? Math.min(Math.max(Math.trunc(asked), MIN_DAYS), MAX_DAYS) : 30
  url.searchParams.set('days', String(days))
  return url.toString()
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const base = process.env.PRINTER_API_URL ?? ''
  const token = process.env.PRINTER_ADMIN_TOKEN ?? ''
  if (!base || !token) {
    return NextResponse.json(
      { error: 'notConfigured', detail: 'PRINTER_API_URL / PRINTER_ADMIN_TOKEN' },
      { status: 501 }
    )
  }

  try {
    const upstream = await fetch(upstreamUrl(req, base), {
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    const body = await upstream.text()
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'upstreamUnreachable', detail: (error as Error).message },
      { status: 502 }
    )
  }
}
