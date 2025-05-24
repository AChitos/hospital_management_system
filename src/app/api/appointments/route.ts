"use server";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyToken } from '@/lib/auth/auth';

// GET all appointments for a doctor
export async function GET(request: NextRequest) {
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
