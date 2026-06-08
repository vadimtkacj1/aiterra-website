import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { publicToken, name, phone, email, message, source } = body

    if (!publicToken || !name?.trim()) {
      return NextResponse.json(
        { error: 'missing required fields' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const lead = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      publicToken,
      name: name.trim(),
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      message: message?.trim() || null,
      source: source || null,
      createdAt: new Date().toISOString(),
    }

    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, 'site-leads.json')

    await mkdir(dataDir, { recursive: true })

    let leads: unknown[] = []
    try {
      const raw = await readFile(filePath, 'utf-8')
      leads = JSON.parse(raw)
    } catch {
      leads = []
    }

    leads.unshift(lead)
    await writeFile(filePath, JSON.stringify(leads, null, 2))

    return NextResponse.json({ ok: true }, { status: 201, headers: CORS_HEADERS })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 500, headers: CORS_HEADERS })
  }
}
