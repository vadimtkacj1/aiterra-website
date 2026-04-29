import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function toBase64(value: string): string {
  return btoa(value)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session')?.value
    const expected = toBase64(process.env.ADMIN_PASSWORD ?? 'admin123')
    if (session !== expected) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
