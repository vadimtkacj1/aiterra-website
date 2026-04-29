import { NextResponse } from 'next/server'

function toBase64(value: string): string {
  return Buffer.from(value).toString('base64')
}

export async function POST(req: Request) {
  const { password } = await req.json()
  const correct = process.env.ADMIN_PASSWORD ?? 'admin123'

  if (password !== correct) {
    return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 })
  }

  const token = toBase64(correct)
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_session', '', { maxAge: 0, path: '/' })
  return res
}
