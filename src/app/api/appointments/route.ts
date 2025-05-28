"use server";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyToken } from '@/lib/auth/auth';

// GET all appointments for a doctor
export async function GET(request: NextRequest) {
  try {
    // Get user ID from middleware (routes in middleware matcher get this header)
    const doctorId = request.headers.get('X-User-ID');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');
    const status = url.searchParams.get('status');
    
    const prisma = new PrismaClient();
    
    try {
      // Build the where clause
      const where: Record<string, unknown> = {};
      
      // If patientId is provided, add it to the where clause
      if (patientId) {
        where.patientId = patientId;
      } else {
        // If no patientId is provided, get all appointments for patients of this doctor
        where.patient = {
          doctorId
        };
      }
      
      // If status is provided, add it to the where clause
      if (status) {
        where.status = status;
      }
      
      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { appointmentDate: 'asc' },
      });

      return NextResponse.json(appointments);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new appointment
export async function POST(request: NextRequest) {
  try {
    // Get user ID from middleware (routes in middleware matcher get this header)
    const doctorId = request.headers.get('X-User-ID');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { patientId, appointmentDate, notes, status } = body;

    if (!patientId || !appointmentDate) {
      return NextResponse.json(
        { error: 'Patient ID and appointment date are required' },
        { status: 400 }
      );
    }

    const prisma = new PrismaClient();
    
    try {
      // Verify the patient belongs to the doctor
      const patient = await prisma.patient.findFirst({
        where: {
          id: patientId,
          doctorId,
        },
      });

      if (!patient) {
        return NextResponse.json(
          { error: 'Patient not found' },
          { status: 404 }
        );
      }

      const appointment = await prisma.appointment.create({
        data: {
          appointmentDate: new Date(appointmentDate),
          notes,
          status: status || 'SCHEDULED',
          patientId,
        },
      });

      return NextResponse.json(appointment, { status: 201 });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
