"use server";

import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from middleware (routes in middleware matcher get this header)
    const doctorId = request.headers.get('X-User-ID');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const prisma = new PrismaClient();
    
    try {
      // Get all medical records for patients of this doctor
      const medicalRecords = await prisma.medicalRecord.findMany({
        where: {
          patient: {
            doctorId: doctorId
          }
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          recordDate: 'desc'
        }
      });

      return NextResponse.json(medicalRecords);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from middleware (routes in middleware matcher get this header)
    const doctorId = request.headers.get('X-User-ID');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.patientId || !data.diagnosis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prisma = new PrismaClient();
    
    try {
      // Verify the patient belongs to this doctor
      const patient = await prisma.patient.findFirst({
        where: {
          id: data.patientId,
          doctorId: doctorId
        }
      });

      if (!patient) {
        return NextResponse.json({ error: 'Patient not found or unauthorized' }, { status: 404 });
      }

      // Create new medical record
      const medicalRecord = await prisma.medicalRecord.create({
        data: {
          recordDate: data.recordDate ? new Date(data.recordDate) : new Date(),
          diagnosis: data.diagnosis,
          symptoms: data.symptoms,
          notes: data.notes,
          vitalSigns: data.vitalSigns,
          treatmentPlan: data.treatmentPlan,
          followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
          patientId: data.patientId
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

      return NextResponse.json(medicalRecord, { status: 201 });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error creating medical record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
