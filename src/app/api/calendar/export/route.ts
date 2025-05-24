import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyToken } from '@/lib/auth/auth';
import { generateICSForAppointments, generateICSForAppointment, createICSDownloadResponse } from '@/lib/ics-export';

/**
 * GET /api/calendar/export - Export appointments as ICS file
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const doctorId = payload.userId;

    // Get query parameters
    const url = new URL(request.url);
    const appointmentId = url.searchParams.get('appointmentId');
    const status = url.searchParams.get('status');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const prisma = new PrismaClient();
    
    try {
      if (appointmentId) {
        // Export single appointment
        const appointment = await prisma.appointment.findFirst({
          where: {
            id: appointmentId,
            patient: { doctorId },
          },
          include: {
            patient: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });

        if (!appointment) {
          return NextResponse.json(
            { error: 'Appointment not found' },
            { status: 404 }
          );
        }

        const icsContent = generateICSForAppointment(appointment);
        const filename = `appointment-${appointment.patient.firstName}-${appointment.patient.lastName}.ics`;
        
        return createICSDownloadResponse(icsContent, filename);
      } else {
        // Export multiple appointments
        const where: any = {
          patient: { doctorId },
        };

        // Add filters
        if (status) {
          where.status = status;
        }

        if (startDate || endDate) {
          where.appointmentDate = {};
          if (startDate) {
            where.appointmentDate.gte = new Date(startDate);
          }
          if (endDate) {
            where.appointmentDate.lte = new Date(endDate);
          }
        }

        const appointments = await prisma.appointment.findMany({
          where,
          include: {
            patient: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { appointmentDate: 'asc' },
        });

        if (appointments.length === 0) {
          return NextResponse.json(
            { error: 'No appointments found for export' },
            { status: 404 }
          );
        }

        const icsContent = generateICSForAppointments(appointments);
        
        // Generate filename based on filters
        let filename = 'appointments';
        if (status) {
          filename += `-${status.toLowerCase()}`;
        }
        if (startDate) {
          filename += `-from-${startDate}`;
        }
        if (endDate) {
          filename += `-to-${endDate}`;
        }
        filename += '.ics';
        
        return createICSDownloadResponse(icsContent, filename);
      }

    } finally {
      await prisma.$disconnect();
    }

  } catch (error) {
    console.error('Error exporting calendar:', error);
    return NextResponse.json(
      { error: 'Failed to export calendar' },
      { status: 500 }
    );
  }
}
