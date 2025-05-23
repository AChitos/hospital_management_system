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
