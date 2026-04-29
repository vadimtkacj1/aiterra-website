import { NextResponse } from 'next/server'
import { deleteAuthor, getAuthorById, upsertAuthor } from '@/lib/authors-server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = getAuthorById(id)
  if (!author) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(author)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const saved = upsertAuthor(id, body)
    return NextResponse.json(saved)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  deleteAuthor(id)
  return NextResponse.json({ ok: true })
}
