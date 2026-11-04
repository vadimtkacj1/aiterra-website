import { NextRequest, NextResponse } from 'next/server'
import { getAllLeads, leadsToCsv } from '@/lib/leads-server'
import { ADMIN_COOKIE, isAdminSession } from '@/lib/admin-session'

const isAuthed = (req: NextRequest) => isAdminSession(req.cookies.get(ADMIN_COOKIE)?.value)

// Leads land on disk at runtime — never serve a build-time snapshot.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!(await isAuthed(req))) {
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
