import { type NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'ws_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get(COOKIE_NAME);
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Validate it's parseable base64 JSON
    try {
      const decoded = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
      if (!decoded.business_id) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
