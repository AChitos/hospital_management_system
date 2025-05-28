import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyToken } from '@/lib/auth/auth';
import { GoogleCalendarService, appointmentToCalendarEvent } from '@/lib/google-calendar';

/**
 * POST /api/calendar/sync - Sync appointment with Google Calendar
 */
export async function POST(request: NextRequest) {
  try {
    // Get user ID from middleware (routes in middleware matcher get this header)
    const doctorId = request.headers.get('X-User-ID');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const { appointmentId } = await request.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const prisma = new PrismaClient();
    
    try {
      // Get doctor with Google Calendar tokens
      const doctor = await prisma.user.findUnique({
        where: { id: doctorId },
        select: {
          googleAccessToken: true,
          googleRefreshToken: true,
          googleCalendarId: true,
        },
      });

      if (!doctor?.googleAccessToken) {
        return NextResponse.json(
          { error: 'Google Calendar not connected. Please connect your calendar first.' },
          { status: 400 }
        );
      }

      // Get appointment with patient info
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          patient: { doctorId },
        },
        include: {
          patient: true,
        },
      });

      if (!appointment) {
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        );
      }

      // Create Google Calendar service
      const calendarService = new GoogleCalendarService(
        doctor.googleAccessToken,
        doctor.googleRefreshToken || undefined
      );

      // Convert appointment to calendar event
      const calendarEvent = appointmentToCalendarEvent(appointment, appointment.patient);

      // Use primary calendar if no specific calendar ID is set
      const calendarId = doctor.googleCalendarId || 'primary';

      // Create or update calendar event
      let eventId: string;
      
      if (appointment.googleCalendarEventId) {
        // Update existing event
        await calendarService.updateEvent(
          calendarId,
          appointment.googleCalendarEventId,
          calendarEvent
        );
        eventId = appointment.googleCalendarEventId;
      } else {
        // Create new event
        eventId = await calendarService.createEvent(calendarId, calendarEvent);
        
        // Store event ID in appointment
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: { googleCalendarEventId: eventId },
        });
      }

      return NextResponse.json({
        success: true,
        eventId,
        message: 'Appointment synced with Google Calendar'
      });

    } finally {
      await prisma.$disconnect();
    }

  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Google Calendar' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/calendar/sync - Remove appointment from Google Calendar
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from middleware (routes in middleware matcher get this header)
    const doctorId = request.headers.get('X-User-ID');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const { appointmentId } = await request.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const prisma = new PrismaClient();
    
    try {
      // Get doctor with Google Calendar tokens
      const doctor = await prisma.user.findUnique({
        where: { id: doctorId },
        select: {
          googleAccessToken: true,
          googleRefreshToken: true,
          googleCalendarId: true,
        },
      });

      if (!doctor?.googleAccessToken) {
        return NextResponse.json(
          { error: 'Google Calendar not connected' },
          { status: 400 }
        );
      }

      // Get appointment
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          patient: { doctorId },
        },
      });

      if (!appointment || !appointment.googleCalendarEventId) {
        return NextResponse.json(
          { error: 'Appointment not found or not synced with calendar' },
          { status: 404 }
        );
      }

      // Create Google Calendar service
      const calendarService = new GoogleCalendarService(
        doctor.googleAccessToken,
        doctor.googleRefreshToken || undefined
      );

      // Use primary calendar if no specific calendar ID is set
      const calendarId = doctor.googleCalendarId || 'primary';

      // Delete calendar event
      await calendarService.deleteEvent(calendarId, appointment.googleCalendarEventId);

      // Remove event ID from appointment
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { googleCalendarEventId: null },
      });

      return NextResponse.json({
        success: true,
        message: 'Appointment removed from Google Calendar'
      });

    } finally {
      await prisma.$disconnect();
    }

  } catch (error) {
    console.error('Error removing from Google Calendar:', error);
    return NextResponse.json(
      { error: 'Failed to remove from Google Calendar' },
      { status: 500 }
    );
  }
}
