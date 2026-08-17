import { NextRequest, NextResponse } from 'next/server'
import { getAllLeads, leadsToCsv } from '@/lib/leads-server'

// Leads hold customer phone numbers and emails, and middleware only guards
// /admin/* pages — never /api/*. So this route checks the session itself.
function isAuthed(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session')?.value
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? 'admin123').toString('base64')
  return Boolean(session) && session === expected
}

// Leads land on disk at runtime — never serve a build-time snapshot.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const leads = getAllLeads()

  if (req.nextUrl.searchParams.get('format') === 'csv') {
    return new NextResponse(leadsToCsv(leads), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="aiterra-leads.csv"',
        'Cache-Control': 'no-store',
      },
    })
  }

  return NextResponse.json(leads, { headers: { 'Cache-Control': 'no-store' } })
}
