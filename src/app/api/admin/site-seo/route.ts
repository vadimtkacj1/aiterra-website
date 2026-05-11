import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { EDITABLE_SEO_ROUTES, type RouteSeoPayload } from '@/lib/site-seo-config'
import { getAllSeoPayloadsForAdmin, writeSiteSeoPayloads } from '@/lib/site-seo-server'

export async function GET() {
  return NextResponse.json(getAllSeoPayloadsForAdmin())
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Record<string, RouteSeoPayload>
    const merged: Record<string, RouteSeoPayload> = {}
    for (const { path: p } of EDITABLE_SEO_ROUTES) {
      const row = body[p]
      if (!row) return NextResponse.json({ error: `missing route: ${p}` }, { status: 400 })
      merged[p] = { ...row, title: (row.title ?? '').trim(), description: (row.description ?? '').trim() }
    }
    writeSiteSeoPayloads(merged)
    for (const { path: p } of EDITABLE_SEO_ROUTES) {
      revalidatePath(p)
    }
    revalidatePath('/sitemap.xml')
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
