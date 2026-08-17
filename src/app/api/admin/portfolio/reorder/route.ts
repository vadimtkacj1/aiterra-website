import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { reorderPortfolioProjects } from '@/lib/portfolio-server'

// middleware only guards /admin/* pages — never /api/* — so check the session here.
function isAuthed(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session')?.value
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? 'admin123').toString('base64')
  return Boolean(session) && session === expected
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const slugs = Array.isArray(body?.slugs) ? body.slugs.map(String) : null
    if (!slugs?.length) {
      return NextResponse.json({ error: 'slugs required' }, { status: 400 })
    }

    const projects = reorderPortfolioProjects(slugs)
    revalidatePath('/')
    revalidatePath('/portfolio')
    revalidatePath('/services/web-development')
    revalidatePath('/sitemap.xml')

    return NextResponse.json(projects)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
