import { NextRequest, NextResponse } from 'next/server';

// Edge-compatible JWT verification with proper signature verification
async function verifyJwtToken(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';
    
    // Split the token
    const [header, payload, signature] = token.split('.');
    
    if (!header || !payload || !signature) {
      return null;
    }

    // Decode and validate header
    const decodedHeader = JSON.parse(atob(header.replace(/-/g, '+').replace(/_/g, '/')));
    if (decodedHeader.alg !== 'HS256') {
      return null;
    }

    // Decode payload
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      return null;
    }

    // Verify signature using Web Crypto API (Edge Runtime compatible)
    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBytes = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const dataToVerify = encoder.encode(`${header}.${payload}`);
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      secretKey,
      signatureBytes,
      dataToVerify
    );

    if (!isValid) {
      return null;
    }

    // Validate required fields
    if (decodedPayload.userId && decodedPayload.email && decodedPayload.role) {
      return {
        userId: decodedPayload.userId,
        email: decodedPayload.email,
        role: decodedPayload.role
      };
    }
    
    return null;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

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
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  const tokenPayload = await verifyJwtToken(token);
  
  if (!tokenPayload) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }

  // Add user information from token to request headers (no database lookup needed)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('X-User-ID', tokenPayload.userId);
  requestHeaders.set('X-User-Email', tokenPayload.email);
  requestHeaders.set('X-User-Role', tokenPayload.role);
  
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
