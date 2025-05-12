"use server";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyToken } from '@/lib/auth/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { appointmentId: string } }
) {
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
    const appointmentId = params.appointmentId;
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
              lastName: true,
              doctorId: true
            }
          }
        }
      });

      if (!appointment) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }

      // Verify the doctor has access to this patient
      if (appointment.patient.doctorId !== doctorId) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
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
  { params }: { params: { appointmentId: string } }
) {
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
    const appointmentId = params.appointmentId;
    const data = await request.json();
    const prisma = new PrismaClient();
    
    try {
      // Check if appointment exists and belongs to this doctor's patient
      const existingAppointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          patient: {
            select: {
              doctorId: true
            }
          }
        }
      });

      if (!existingAppointment) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }

      // Check if this doctor has access to this patient
      if (existingAppointment.patient.doctorId !== doctorId) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
      }

      // Update appointment
      const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
          status: data.status,
          notes: data.notes
        },
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
  { params }: { params: { appointmentId: string } }
) {
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
    const appointmentId = params.appointmentId;
    const prisma = new PrismaClient();
    
    try {
      // Check if appointment exists and belongs to this doctor's patient
      const existingAppointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          patient: {
            select: {
              doctorId: true
            }
          }
        }
      });

      if (!existingAppointment) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }

      // Check if this doctor has access to this patient
      if (existingAppointment.patient.doctorId !== doctorId) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
      }

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
