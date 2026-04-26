import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif']
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: 'סוג קובץ לא מורשה' }, { status: 400 })
  }

  const safeName = `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, '_')}`
  const dir = path.join(process.cwd(), 'public', 'images', 'blog')
  await mkdir(dir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, safeName), buffer)

  return NextResponse.json({ url: `/images/blog/${safeName}` })
}
