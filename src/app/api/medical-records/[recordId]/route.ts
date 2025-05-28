import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    // Get user ID from middleware (routes in middleware matcher get this header)
    const doctorId = request.headers.get('X-User-ID');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { recordId } = await params;
    const prisma = new PrismaClient();
    
    try {
      // Get the medical record by ID and verify access
      const medicalRecord = await prisma.medicalRecord.findFirst({
        where: { 
          id: recordId,
          patient: { doctorId }
        },
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
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    // Get user ID from middleware (routes in middleware matcher get this header)
    const doctorId = request.headers.get('X-User-ID');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { recordId } = await params;
    const data = await request.json();
    const prisma = new PrismaClient();
    
    try {
      // Verify the medical record belongs to this doctor
      const existingRecord = await prisma.medicalRecord.findFirst({
        where: {
          id: recordId,
          patient: { doctorId }
        }
      });

      if (!existingRecord) {
        return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
      }

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
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    // Get user ID from middleware (routes in middleware matcher get this header)
    const doctorId = request.headers.get('X-User-ID');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { recordId } = await params;
    const prisma = new PrismaClient();
    
    try {
      // Verify the medical record belongs to this doctor
      const existingRecord = await prisma.medicalRecord.findFirst({
        where: {
          id: recordId,
          patient: { doctorId }
        }
      });

      if (!existingRecord) {
        return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
      }

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
