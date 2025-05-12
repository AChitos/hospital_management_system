import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/utils/db';

// GET all prescriptions for a patient
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

    const prescriptions = await db.prescription.findMany({
      where: { patientId },
      orderBy: { issuedDate: 'desc' },
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new prescription for a patient
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
    const { medication, dosage, frequency, duration, notes, expiryDate } = body;

    if (!medication || !dosage || !frequency || !duration) {
      return NextResponse.json(
        { error: 'Medication, dosage, frequency, and duration are required' },
        { status: 400 }
      );
    }

    const prescription = await db.prescription.create({
      data: {
        medication,
        dosage,
        frequency,
        duration,
        notes,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        patientId,
        doctorId,
      },
    });

    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
