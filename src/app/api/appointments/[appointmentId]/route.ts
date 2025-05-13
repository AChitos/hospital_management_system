import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  try {
    const appointmentId = params.appointmentId as string;
    const prisma = new PrismaClient();
    
    try {
      // Get the appointment by ID
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      if (!appointment) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }

      return NextResponse.json(appointment);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  try {
    const appointmentId = params.appointmentId as string;
    const data = await request.json();
    const prisma = new PrismaClient();
    
    try {
      // Update appointment
      const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
          status: data.status,
          notes: data.notes
        }
      });

      return NextResponse.json(updatedAppointment);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  try {
    const appointmentId = params.appointmentId as string;
    const prisma = new PrismaClient();
    
    try {
      // Delete appointment
      await prisma.appointment.delete({
        where: { id: appointmentId }
      });

      return NextResponse.json({ message: 'Appointment deleted successfully' });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
