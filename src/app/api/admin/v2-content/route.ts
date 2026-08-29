import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { v2ContentDefaults, type V2ContentKey } from '@/app/v2/content'
import {
  readV2ContentFile,
  resetV2Content,
  resetV2Section,
  saveV2Section,
} from '@/lib/v2-content-server'

function isAuthed(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session')?.value
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? 'admin123').toString('base64')
  return Boolean(session) && session === expected
}

function isContentKey(value: unknown): value is V2ContentKey {
  return typeof value === 'string' && Object.hasOwn(v2ContentDefaults, value)
}

function refresh() {
  revalidatePath('/v2', 'layout')
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    const file = readV2ContentFile()
    return NextResponse.json({
      defaults: v2ContentDefaults,
      overrides: file.overrides,
      updatedAt: file.updatedAt,
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    const body = (await req.json()) as { key?: unknown; value?: unknown }
    if (!isContentKey(body.key)) {
      return NextResponse.json({ error: 'unknown section' }, { status: 400 })
    }
    const file = saveV2Section(body.key, body.value)
    refresh()
    return NextResponse.json({ ok: true, overrides: file.overrides, updatedAt: file.updatedAt })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const key = new URL(req.url).searchParams.get('key')
  const file = key ? (isContentKey(key) ? resetV2Section(key) : null) : resetV2Content()
  if (!file) return NextResponse.json({ error: 'unknown section' }, { status: 400 })
  refresh()
  return NextResponse.json({ ok: true, overrides: file.overrides, updatedAt: file.updatedAt })
}
