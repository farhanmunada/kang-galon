import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, verifyToken } from './lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati file statis, aset Next.js, dan icon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  // 1. Jika pengguna belum login
  if (!session) {
    if (pathname === '/login') {
      return NextResponse.next();
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika sudah login dan mengakses halaman login
  if (pathname === '/login') {
    const dest = session.role === 'COURIER' ? '/courier' : '/';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // 3. Aturan RBAC: Kurir dilarang mengakses menu pemilik
  if (session.role === 'COURIER' && pathname !== '/courier') {
    return NextResponse.redirect(new URL('/courier', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
