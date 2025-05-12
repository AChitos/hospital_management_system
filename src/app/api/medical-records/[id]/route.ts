"use server";

import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const id = params.id;
    const prisma = new PrismaClient();
    
    try {
      // Get the medical record by ID
      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { id },
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

      if (!medicalRecord) {
        return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
      }

      return NextResponse.json(medicalRecord);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error fetching medical record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const id = params.id;
    const data = await request.json();
    const prisma = new PrismaClient();
    
    try {
      // Check if record exists
      const existingRecord = await prisma.medicalRecord.findUnique({
        where: { id }
      });

      if (!existingRecord) {
        return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
      }

      // Update medical record
      const updatedRecord = await prisma.medicalRecord.update({
        where: { id },
        data: {
          diagnosis: data.diagnosis,
          symptoms: data.symptoms,
          notes: data.notes,
          vitalSigns: data.vitalSigns,
          treatmentPlan: data.treatmentPlan,
          followUpDate: data.followUpDate ? new Date(data.followUpDate) : null
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

      return NextResponse.json(updatedRecord);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error updating medical record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const id = params.id;
    const prisma = new PrismaClient();
    
    try {
      // Check if record exists
      const existingRecord = await prisma.medicalRecord.findUnique({
        where: { id }
      });

      if (!existingRecord) {
        return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
      }

      // Delete medical record
      await prisma.medicalRecord.delete({
        where: { id }
      });

      return NextResponse.json({ message: 'Medical record deleted successfully' });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
