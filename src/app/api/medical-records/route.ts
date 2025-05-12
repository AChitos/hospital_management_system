"use server";

import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/auth';

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

    const prisma = new PrismaClient();
    
    try {
      // Get all medical records with patient information
      const medicalRecords = await prisma.medicalRecord.findMany({
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
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.patientId || !data.diagnosis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prisma = new PrismaClient();
    
    try {
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
