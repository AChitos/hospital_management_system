"use server";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyToken } from '@/lib/auth/auth';

// GET all prescriptions
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
    const patientId = url.searchParams.get('patientId');
    
    const prisma = new PrismaClient();
    
    try {
      // Build the where clause
      const where: Record<string, unknown> = {};
      
      // If patientId is provided, add it to the where clause
      if (patientId) {
        where.patientId = patientId;
        
        // Verify the doctor has access to this patient
        const patient = await prisma.patient.findFirst({
          where: {
            id: patientId,
            doctorId
          }
        });

        if (!patient) {
          return NextResponse.json({ error: 'Patient not found or access denied' }, { status: 404 });
        }
      } else {
        // If no patientId is provided, get all prescriptions for patients of this doctor
        where.doctorId = doctorId;
      }
      
      // Get all prescriptions
      const prescriptions = await prisma.prescription.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { issuedDate: 'desc' }
      });

      return NextResponse.json(prescriptions);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new prescription
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
    const data = await request.json();
    const { patientId, medication, dosage, frequency, duration, notes, expiryDate } = data;
    
    if (!patientId || !medication || !dosage || !frequency) {
      return NextResponse.json(
        { error: 'Patient ID, medication, dosage, and frequency are required' },
        { status: 400 }
      );
    }
    
    const prisma = new PrismaClient();
    
    try {
      // Verify the doctor has access to this patient
      const patient = await prisma.patient.findFirst({
        where: {
          id: patientId,
          doctorId
        }
      });

      if (!patient) {
        return NextResponse.json({ error: 'Patient not found or access denied' }, { status: 404 });
      }

      // Create new prescription
      const prescription = await prisma.prescription.create({
        data: {
          medication,
          dosage,
          frequency,
          duration,
          notes,
          issuedDate: new Date(),
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          patientId,
          doctorId
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

      return NextResponse.json(prescription, { status: 201 });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
