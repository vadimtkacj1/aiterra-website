import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createPortfolioProject, getAllPortfolioProjects } from '@/lib/portfolio-server'

export async function GET() {
  return NextResponse.json(getAllPortfolioProjects())
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const project = createPortfolioProject(body)
    revalidatePath('/')
    revalidatePath('/portfolio')
    revalidatePath('/services/web-development')
    revalidatePath('/sitemap.xml')
    revalidatePath(`/portfolio/${project.slug}`)
    return NextResponse.json(project, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
