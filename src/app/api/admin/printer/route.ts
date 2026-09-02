import { NextRequest, NextResponse } from 'next/server'

function isAuthed(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session')?.value
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? 'admin123').toString('base64')
  return Boolean(session) && session === expected
}

export const dynamic = 'force-dynamic'

const VIEWS: Record<string, string> = {
  stats: '/v1/admin/stats',
  devices: '/v1/admin/devices',
  audit: '/v1/admin/audit',
}

function upstreamUrl(req: NextRequest, base: string): string | null {
  const view = req.nextUrl.searchParams.get('view') ?? 'devices'
  const path = VIEWS[view]
  if (!path) return null

  const url = new URL(base.replace(/\/+$/, '') + path)
  for (const key of ['shopId', 'limit']) {
    const value = req.nextUrl.searchParams.get(key)
    if (value) url.searchParams.set(key, value)
  }
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

  const url = upstreamUrl(req, base)
  if (!url) return NextResponse.json({ error: 'unknownView' }, { status: 400 })

  try {
    const upstream = await fetch(url, {
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
