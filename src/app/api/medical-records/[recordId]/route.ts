import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  try {
    const recordId = params.recordId as string;
    const prisma = new PrismaClient();
    
    try {
      // Get the medical record by ID
      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { id: recordId },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          doctor: {
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
  { params }: { params: Record<string, string | string[]> }
) {
  try {
    const recordId = params.recordId as string;
    const data = await request.json();
    const prisma = new PrismaClient();
    
    try {
      // Update medical record
      const updatedRecord = await prisma.medicalRecord.update({
        where: { id: recordId },
        data: {
          diagnosis: data.diagnosis,
          symptoms: data.symptoms,
          notes: data.notes,
          vitalSigns: data.vitalSigns,
          treatmentPlan: data.treatmentPlan,
          followUpDate: data.followUpDate ? new Date(data.followUpDate) : null
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
  { params }: { params: Record<string, string | string[]> }
) {
  try {
    const recordId = params.recordId as string;
    const prisma = new PrismaClient();
    
    try {
      // Delete medical record
      await prisma.medicalRecord.delete({
        where: { id: recordId }
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
