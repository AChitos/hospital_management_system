import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from '@/generated/prisma';
import { verifyToken } from '@/lib/auth/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> } 
) {
  const { appointmentId } = await params;
  
  try {
    // Verify authentication (with development bypass)
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    // Development mode bypass
    const isDevelopment = process.env.NODE_ENV === 'development';
    let doctorId = 'dfa4b671-1730-474b-9a1a-f0fffd004748'; // Use the actual doctor ID from seeded data
    
    if (!isDevelopment) {
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      doctorId = payload.userId;
    }

    const prisma = new PrismaClient();
    
    try {
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          patient: { doctorId }, // Ensure the appointment belongs to the authenticated doctor
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              contactNumber: true,
              dateOfBirth: true,
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

      // Format the patient data properly for the response
      return NextResponse.json({
        id: appointment.id,
        appointmentDate: appointment.appointmentDate.toISOString(),
        status: appointment.status,
        notes: appointment.notes,
        googleCalendarEventId: appointment.googleCalendarEventId,
        patient: {
          id: appointment.patient.id,
          firstName: appointment.patient.firstName,
          lastName: appointment.patient.lastName,
          email: appointment.patient.email,
          contactNumber: appointment.patient.contactNumber,
          dateOfBirth: appointment.patient.dateOfBirth?.toISOString(),
        },
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
      });
      
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  
  try {
    // Verify authentication (with development bypass)
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    // Development mode bypass
    const isDevelopment = process.env.NODE_ENV === 'development';
    let doctorId = 'dfa4b671-1730-474b-9a1a-f0fffd004748'; // Use the actual doctor ID from seeded data
    
    if (!isDevelopment) {
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      doctorId = payload.userId;
    }

    const data = await request.json();
    const prisma = new PrismaClient();
    
    try {
      // First verify the appointment belongs to the authenticated doctor
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          patient: { doctorId },
        },
      });

      if (!existingAppointment) {
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        );
      }

      // Update the appointment
      const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: data.status,
          notes: data.notes,
          appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              contactNumber: true,
              dateOfBirth: true,
            },
          },
        },
      });

      // Format the patient data properly for the response
      return NextResponse.json({
        id: updatedAppointment.id,
        appointmentDate: updatedAppointment.appointmentDate.toISOString(),
        status: updatedAppointment.status,
        notes: updatedAppointment.notes,
        googleCalendarEventId: updatedAppointment.googleCalendarEventId,
        patient: {
          id: updatedAppointment.patient.id,
          firstName: updatedAppointment.patient.firstName,
          lastName: updatedAppointment.patient.lastName,
          email: updatedAppointment.patient.email,
          contactNumber: updatedAppointment.patient.contactNumber,
          dateOfBirth: updatedAppointment.patient.dateOfBirth?.toISOString(),
        },
        createdAt: updatedAppointment.createdAt.toISOString(),
        updatedAt: updatedAppointment.updatedAt.toISOString(),
      });
      
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  
  try {
    // Verify authentication (with development bypass)
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    // Development mode bypass
    const isDevelopment = process.env.NODE_ENV === 'development';
    let doctorId = 'dfa4b671-1730-474b-9a1a-f0fffd004748'; // Use the actual doctor ID from seeded data
    
    if (!isDevelopment) {
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      doctorId = payload.userId;
    }

    const prisma = new PrismaClient();
    
    try {
      // First verify the appointment belongs to the authenticated doctor
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          patient: { doctorId },
        },
      });

      if (!existingAppointment) {
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        );
      }

      // Delete the appointment
      await prisma.appointment.delete({
        where: { id: appointmentId },
      });

      return NextResponse.json({ 
        message: "Appointment deleted successfully" 
      });
      
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
