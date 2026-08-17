import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import nodemailer from 'nodemailer'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

interface Lead {
  id: string
  publicToken: string
  name: string
  phone: string | null
  email: string | null
  message: string | null
  source: string | null
  createdAt: string
}

// Email the lead to the office inbox. Best-effort: configured via runtime env
// (docker-compose env_file → .env). If SMTP isn't set up yet, this is a no-op
// and the lead is still persisted to disk, so nothing is lost.
async function notifyByEmail(lead: Lead): Promise<void> {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host) {
    // Loud on purpose: a silently skipped notification looks identical to a
    // delivered one, and leads went unnoticed for weeks that way.
    console.warn('lead saved but NOT emailed — SMTP_HOST missing in .env')
    return
  }

  const to = process.env.LEAD_NOTIFY_TO || 'info@aiterra.co.il'
  const from = process.env.LEAD_NOTIFY_FROM || user || to
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = process.env.SMTP_SECURE === 'true' || port === 465

  // Google Workspace SMTP relay authenticates this server by IP allowlist, so
  // credentials are optional — pass auth only when a mailbox login is set.
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    ...(user && pass ? { auth: { user, pass } } : {}),
  })

  const rows: [string, string | null][] = [
    ['שם', lead.name],
    ['טלפון', lead.phone],
    ['אימייל', lead.email],
    ['הודעה', lead.message],
    ['מקור', lead.source],
    ['התקבל', lead.createdAt],
  ]
  const text = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px">
    <h2 style="color:#1B1BB3">ליד חדש מהאתר</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="font-weight:bold">${k}</td><td>${v}</td></tr>`).join('')}
    </table>
  </div>`

  await transporter.sendMail({
    from,
    to,
    replyTo: lead.email || undefined,
    subject: `ליד חדש מהאתר — ${lead.name}`,
    text,
    html,
  })
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

    const lead: Lead = {
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

    // Best-effort email notification — never fail the lead on an email error
    // (it's already safely persisted above).
    try {
      await notifyByEmail(lead)
    } catch (mailErr) {
      console.error('lead email notification failed:', mailErr)
    }

    return NextResponse.json({ ok: true }, { status: 201, headers: CORS_HEADERS })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 500, headers: CORS_HEADERS })
  }
}
