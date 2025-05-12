import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/utils/db';

// GET all medical records for a patient
export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const doctorId = request.headers.get('X-User-ID');
    const { patientId } = params;

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
  { params }: { params: { patientId: string } }
) {
  try {
    const doctorId = request.headers.get('X-User-ID');
    const { patientId } = params;

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

    const body = await request.json();
    const { diagnosis, symptoms, notes, vitalSigns, treatmentPlan, followUpDate } = body;

    if (!diagnosis) {
      return NextResponse.json(
        { error: 'Diagnosis is required' },
        { status: 400 }
      );
    }

    const medicalRecord = await db.medicalRecord.create({
      data: {
        diagnosis,
        symptoms,
        notes,
        vitalSigns,
        treatmentPlan,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        patientId,
      },
    });

    return NextResponse.json(medicalRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating medical record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
