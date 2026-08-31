import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { appendLead, setLeadDelivery } from '@/lib/leads-server'
import type { SiteLead } from '@/lib/leads-server'
import { forwardLeadToCrm } from '@/lib/crm-leads'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Email the lead to the office inbox. Best-effort: configured via runtime env
// (docker-compose env_file → .env). If SMTP isn't set up yet, this is a no-op
// and the lead is still persisted to disk, so nothing is lost.
async function notifyByEmail(lead: SiteLead): Promise<void> {
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
    ['שירות', lead.treatment],
    ['הודעה', lead.message],
    ['מקור', lead.source],
    ['התקבל', lead.createdAt],
  ]
  const text = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px">
    <h2 style="color:#2447D6">ליד חדש מהאתר</h2>
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
    const { publicToken, name, phone, email, message, treatment, source } = body

    if (!publicToken || !name?.trim()) {
      return NextResponse.json(
        { error: 'missing required fields' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const lead: SiteLead = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      publicToken,
      name: name.trim(),
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      message: message?.trim() || null,
      treatment: treatment?.trim() || null,
      source: source || null,
      createdAt: new Date().toISOString(),
    }

    await appendLead(lead)

    const [, crm] = await Promise.all([
      notifyByEmail(lead).catch((mailErr) => {
        console.error('lead email notification failed:', mailErr)
      }),
      forwardLeadToCrm(lead),
    ])

    if (crm !== 'skipped') {
      await setLeadDelivery(lead.id, crm).catch((writeErr) => {
        console.error('could not record CRM delivery status:', writeErr)
      })
    }

    return NextResponse.json({ ok: true, crm }, { status: 201, headers: CORS_HEADERS })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 500, headers: CORS_HEADERS })
  }
}
