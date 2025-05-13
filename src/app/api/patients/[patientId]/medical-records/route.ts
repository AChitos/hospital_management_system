import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/utils/db';

// GET all medical records for a patient
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  try {
    const doctorId = request.headers.get('X-User-ID');
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
    const doctorId = request.headers.get('X-User-ID');
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
