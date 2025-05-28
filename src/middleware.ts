import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth/auth';

export async function middleware(request: NextRequest) {
  // Get token from Authorization header
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  const tokenPayload = verifyToken(token);
  
  if (!tokenPayload) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }

  // Verify that the user exists
  const user = await getUserById(tokenPayload.userId);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - User not found' },
      { status: 401 }
    );
  }
  
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

// Routes that require authentication
export const config = {
  matcher: [
    '/api/patients/:path*',
    '/api/prescriptions/:path*', 
    '/api/appointments/:path*',
    '/api/medical-records/:path*',
    '/api/auth/me',
    '/api/calendar/:path*',
    '/api/dashboard/:path*'
  ],
};
