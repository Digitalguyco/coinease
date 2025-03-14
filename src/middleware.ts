import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/invest',
  '/dashboard/transactions',
  '/dashboard/deposit',
  '/dashboard/withdraw'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Check if user is authenticated by looking for token in cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  
  if (!accessToken) {
    // Redirect to login page if not authenticated
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api routes
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico (favicon file)
     * - /login, /signup (auth pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
  ],
}; 