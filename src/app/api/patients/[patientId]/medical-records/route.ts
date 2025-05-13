import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/utils/db';
import { verifyToken } from '@/lib/auth/auth';

// GET all medical records for a patient
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  try {
    // Get doctorId from X-User-ID header first
    let doctorId = request.headers.get('X-User-ID');
    
    // If X-User-ID header is not present, try to get from Authorization token
    if (!doctorId) {
      // Check for both lowercase and proper-case Authorization header
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
      const token = authHeader?.split(' ')[1];
      
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      
      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      
      doctorId = payload.userId;
    }
    
    const patientId = params.patientId as string;

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the patient belongs to the doctor
    const patient = await db.patient.findFirst({
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

    const medicalRecords = await db.medicalRecord.findMany({
      where: { patientId },
      orderBy: { recordDate: 'desc' },
    });

    return NextResponse.json(medicalRecords);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new medical record for a patient
export async function POST(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  try {
    // Get doctorId from X-User-ID header first
    let doctorId = request.headers.get('X-User-ID');
    
    // If X-User-ID header is not present, try to get from Authorization token
    if (!doctorId) {
      // Check for both lowercase and proper-case Authorization header
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
      const token = authHeader?.split(' ')[1];
      
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      
      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      
      doctorId = payload.userId;
    }
    
    const patientId = params.patientId as string;

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the patient belongs to the doctor
    const patient = await db.patient.findFirst({
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

    const data = await request.json();

    const newMedicalRecord = await db.medicalRecord.create({
      data: {
        patientId,
        doctorId, // Now correctly maps to the doctorId field in the schema
        diagnosis: data.diagnosis,
        symptoms: data.symptoms,
        notes: data.notes,
        vitalSigns: data.vitalSigns,
        treatmentPlan: data.treatmentPlan,
        recordDate: data.recordDate ? new Date(data.recordDate) : new Date(),
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
      },
    });

    return NextResponse.json(newMedicalRecord);
  } catch (error) {
    console.error('Error creating medical record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
