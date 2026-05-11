import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  deletePortfolioProject,
  getProjectBySlug,
  updatePortfolioProject,
} from '@/lib/portfolio-server'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const body = await req.json()
    const updated = updatePortfolioProject(slug, body)
    revalidatePath('/')
    revalidatePath('/portfolio')
    revalidatePath('/services/web-development')
    revalidatePath('/sitemap.xml')
    revalidatePath(`/portfolio/${slug}`)
    return NextResponse.json(updated)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  deletePortfolioProject(slug)
  revalidatePath('/')
  revalidatePath('/portfolio')
  revalidatePath('/services/web-development')
  revalidatePath('/sitemap.xml')
  revalidatePath(`/portfolio/${slug}`)
  return NextResponse.json({ ok: true })
}
