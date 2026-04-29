import { NextResponse } from 'next/server'
import { getAllAuthors, saveAllAuthors } from '@/lib/authors-server'

export async function GET() {
  return NextResponse.json(getAllAuthors())
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const saved = saveAllAuthors(body)
    return NextResponse.json(saved)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
