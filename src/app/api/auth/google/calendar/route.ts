import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

/**
 * GET /api/auth/google/calendar - Get Google Calendar authorization URL
 */
export async function GET() {
  try {
    const authUrl = GoogleCalendarService.getAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}
