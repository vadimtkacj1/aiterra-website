import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, isAdminSession } from '@/lib/admin-session'

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/api/admin/auth'])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next()

  if (await isAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next()

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  return NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
