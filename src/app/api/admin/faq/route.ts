import { NextResponse } from 'next/server'
import { getAllFaqData, saveAllFaqData, getFaqData, saveFaqData } from '@/lib/faq-server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page')
  if (page) {
    return NextResponse.json(getFaqData(page))
  }
  return NextResponse.json(getAllFaqData())
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page')
    const body = await req.json()
    if (page) {
      saveFaqData(page, body)
    } else {
      saveAllFaqData(body)
    }
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
