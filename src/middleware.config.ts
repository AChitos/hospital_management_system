import { NextRequest } from 'next/server';
import { matcher } from 'next/dist/shared/lib/match-path';

// Routes that require authentication
export const config = {
  matcher: [
    '/api/patients/:path*',
    '/api/prescriptions/:path*',
    '/api/appointments/:path*',
    '/api/medical-records/:path*',
    '/api/auth/me',
  ],
};
