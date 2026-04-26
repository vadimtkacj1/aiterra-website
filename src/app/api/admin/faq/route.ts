import { NextResponse } from 'next/server'
import { getFaqData, saveFaqData } from '@/lib/faq-server'

export async function GET() {
  return NextResponse.json(getFaqData())
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    saveFaqData(body)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
