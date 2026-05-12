import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file || !(file instanceof Blob)) return NextResponse.json({ error: 'no file' }, { status: 400 })
    console.log('[upload] file:', (file as File).name, 'size:', file.size)

    const fileName = (file as File).name ?? 'upload'
    const ext = fileName.split('.').pop()?.toLowerCase() ?? 'jpg'
    const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'heic', 'heif']
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: `סוג קובץ לא מורשה: .${ext}` }, { status: 400 })
    }

    const safeName = `${Date.now()}-${fileName.replace(/[^a-z0-9.\-_]/gi, '_')}`
    const dest = ((formData.get('dest') as string | null) ?? 'blog').trim().toLowerCase()
    const subdir = dest === 'portfolio' ? 'portfolio' : 'blog'
    const dir = path.join(process.cwd(), 'public', 'images', subdir)

    await mkdir(dir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(dir, safeName), buffer)

    console.log('[upload] saved to:', path.join(dir, safeName))
    return NextResponse.json({ url: `/images/${subdir}/${safeName}` })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'upload error'
    console.error('[upload]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
