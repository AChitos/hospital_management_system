import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export class GoogleCalendarService {
  private calendar: any;

  constructor(accessToken: string, refreshToken?: string) {
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  }

  /**
   * Get authorization URL for OAuth flow
   */
  static getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  static async getTokens(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }

  /**
   * Create a calendar event
   */
  async createEvent(calendarId: string, event: CalendarEvent): Promise<string> {
    try {
      const response = await this.calendar.events.insert({
        calendarId,
        resource: event,
      });
      return response.data.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  /**
   * Update a calendar event
   */
  async updateEvent(calendarId: string, eventId: string, event: CalendarEvent): Promise<void> {
    try {
      await this.calendar.events.update({
        calendarId,
        eventId,
        resource: event,
      });
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId,
        eventId,
      });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  /**
   * Get calendar events within a date range
   */
  async getEvents(
    calendarId: string,
    timeMin: string,
    timeMax: string
  ): Promise<any[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  /**
   * Get user's calendar list
   */
  async getCalendars(): Promise<any[]> {
    try {
      const response = await this.calendar.calendarList.list();
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw new Error('Failed to fetch calendars');
    }
  }
}

/**
 * Convert appointment to Google Calendar event format
 */
export function appointmentToCalendarEvent(appointment: any, patientInfo: any): CalendarEvent {
  const start = new Date(appointment.appointmentDate);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

  return {
    summary: `Appointment with ${patientInfo.firstName} ${patientInfo.lastName}`,
    description: `Medical appointment\n\nPatient: ${patientInfo.firstName} ${patientInfo.lastName}\nNotes: ${appointment.notes || 'No notes'}`,
    start: {
      dateTime: start.toISOString(),
      timeZone: 'America/New_York', // Should be configurable
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: 'America/New_York',
    },
    attendees: patientInfo.email ? [{
      email: patientInfo.email,
      displayName: `${patientInfo.firstName} ${patientInfo.lastName}`
    }] : undefined,
  };
}
