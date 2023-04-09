import { Routes } from 'consts';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (
    !request.cookies.has('accessToken') &&
    !request.cookies.has('refreshToken')
  ) {
    if (!request.nextUrl.pathname.match('^(/$|/public/[0-9a-zA-Z-]+)$')) {
      return NextResponse.redirect(new URL(Routes.LOGIN, request.url));
    }
  }
  if (request.cookies.has('accessToken')) {
    if (
      !request.nextUrl.pathname.match(
        '//apartments/[0-9a-zA-Z-]+|/apartments|/invoice|/guests|/public/[0-9a-zA-Z-]+/x'
      )
    ) {
      return NextResponse.redirect(new URL(Routes.APARTMENTS, request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets (static asset files in public directory)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|assets|logo.png|favicon.ico|Styles/Assets).*)',
  ],
};
