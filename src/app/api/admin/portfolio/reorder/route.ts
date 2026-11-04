import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { reorderPortfolioProjects } from '@/lib/portfolio-server'
import { ADMIN_COOKIE, isAdminSession } from '@/lib/admin-session'

const isAuthed = (req: NextRequest) => isAdminSession(req.cookies.get(ADMIN_COOKIE)?.value)

export async function POST(req: NextRequest) {
  if (!(await isAuthed(req))) {
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
