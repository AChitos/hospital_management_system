import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';
import { verifyToken } from '@/lib/auth/auth';

/**
 * GET /api/auth/google/calendar - Get Google Calendar authorization URL
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication to get user info
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Generate auth URL with the user's token in state parameter
    const authUrl = GoogleCalendarService.getAuthUrl(token);
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}
