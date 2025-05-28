import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth/auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Define protected routes
  const protectedRoutes = [
    '/api/patients',
    '/api/prescriptions',
    '/api/appointments',
    '/api/medical-records',
    '/api/auth/me',
    '/api/calendar',
    '/api/dashboard'
  ];
  
  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    // Allow unprotected routes to pass through
    return NextResponse.next();
  }
  
  console.log('Middleware running for protected route:', pathname);
  
  // Get token from Authorization header
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No valid auth header found for:', pathname);
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  const tokenPayload = verifyToken(token);
  
  if (!tokenPayload) {
    console.log('Invalid token for:', pathname);
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }

  // Verify that the user exists
  const user = await getUserById(tokenPayload.userId);
  
  if (!user) {
    console.log('User not found for:', pathname);
    return NextResponse.json(
      { error: 'Unauthorized - User not found' },
      { status: 401 }
    );
  }
  
  console.log('Middleware passed for:', pathname, 'User:', user.id);
  
  // Add user to request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('X-User-ID', user.id);
  
  // Continue to the route handler
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure matcher to run on all API routes (we'll filter inside the middleware)
export const config = {
  matcher: [
    '/api/:path*'
  ],
};
