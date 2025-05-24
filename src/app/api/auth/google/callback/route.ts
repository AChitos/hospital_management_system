import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';
import { PrismaClient } from '@/generated/prisma';
import { verifyToken } from '@/lib/auth/auth';

/**
 * GET /api/auth/google/callback - Handle Google OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // Should contain user auth token

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code not provided' },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokens = await GoogleCalendarService.getTokens(code);

    if (!tokens.access_token) {
      return NextResponse.json(
        { error: 'Failed to obtain access token' },
        { status: 400 }
      );
    }

    // Get user ID from state parameter
    let userId: string | null = null;
    if (state) {
      try {
        // State should contain the user's JWT token
        const payload = await verifyToken(state);
        if (payload) {
          userId = payload.userId;
        }
      } catch {
        // Invalid token in state
        console.error('Invalid token in state parameter');
      }
    }

    // If we don't have userId, redirect to calendar with error
    if (!userId) {
      const redirectUrl = new URL('/calendar', request.url);
      redirectUrl.searchParams.set('error', 'auth_failed');
      return NextResponse.redirect(redirectUrl);
    }

    // Store tokens in database
    const prisma = new PrismaClient();
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token || null,
          googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          googleCalendarId: 'primary', // Default to primary calendar
        },
      });

      // Redirect to calendar page with success
      const redirectUrl = new URL('/calendar', request.url);
      redirectUrl.searchParams.set('setup', 'success');
      return NextResponse.redirect(redirectUrl);
    } finally {
      await prisma.$disconnect();
    }

  } catch (error) {
    console.error('Error in Google OAuth callback:', error);
    const redirectUrl = new URL('/calendar', request.url);
    redirectUrl.searchParams.set('error', 'setup_failed');
    return NextResponse.redirect(redirectUrl);
  }
}
