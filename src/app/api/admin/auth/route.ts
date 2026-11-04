import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, adminSessionToken } from '@/lib/admin-session'

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: '' }))
  const correct = process.env.ADMIN_PASSWORD
  const token = await adminSessionToken()

  if (!correct || !token || password !== correct) {
    return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '', { maxAge: 0, path: '/' })
  return res
}
