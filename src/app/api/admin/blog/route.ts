import { NextResponse } from 'next/server'
import { getAllPosts, createPost } from '@/lib/blog-server'

export async function GET() {
  return NextResponse.json(getAllPosts())
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const post = createPost(body)
    return NextResponse.json(post, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
