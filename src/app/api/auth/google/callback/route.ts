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
    const state = url.searchParams.get('state'); // Could contain user ID or return URL

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

    // Get user ID from state or token
    let userId: string | null = null;
    if (state) {
      try {
        const decoded = JSON.parse(atob(state));
        userId = decoded.userId;
      } catch {
        // Invalid state, we'll need to get user ID another way
      }
    }

    // If we don't have userId from state, try to get it from a session or require re-auth
    if (!userId) {
      // For now, we'll redirect to a page where user can complete the setup
      const redirectUrl = new URL('/calendar/setup', request.url);
      redirectUrl.searchParams.set('tokens', btoa(JSON.stringify(tokens)));
      return NextResponse.redirect(redirectUrl);
    }

    // Store tokens in database
    const prisma = new PrismaClient();
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
          googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
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
