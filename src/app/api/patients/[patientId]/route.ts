import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/utils/db';
import { verifyToken } from '@/lib/auth/auth';

// GET a specific patient
export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
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
    
    const doctorId = payload.userId;
    const { patientId } = params;

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const patient = await db.patient.findUnique({
      where: {
        id: patientId,
        doctorId, // Ensure the patient belongs to the doctor
      },
      include: {
        medicalRecords: {
          orderBy: { recordDate: 'desc' },
        },
        prescriptions: {
          orderBy: { issuedDate: 'desc' },
        },
        appointments: {
          orderBy: { appointmentDate: 'desc' },
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE a specific patient
export async function PUT(
  request: NextRequest,
  { params }: { params: { patientId: string } }
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
    
    const doctorId = payload.userId;
    const { patientId } = params;

    const body = await request.json();
    const { firstName, lastName, dateOfBirth, gender, contactNumber, email, address, bloodType, allergies } = body;

    if (!firstName || !lastName || !dateOfBirth || !gender) {
      return NextResponse.json(
        { error: 'First name, last name, date of birth, and gender are required' },
        { status: 400 }
      );
    }

    // Check if patient exists and belongs to doctor
    const existingPatient = await db.patient.findFirst({
      where: {
        id: patientId,
        doctorId,
      },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    const updatedPatient = await db.patient.update({
      where: { id: patientId },
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        contactNumber,
        email,
        address,
        bloodType,
        allergies,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a specific patient
export async function DELETE(
  request: NextRequest,
  { params }: { params: { patientId: string } }
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
    
    const doctorId = payload.userId;
    const { patientId } = params;

    // Check if patient exists and belongs to doctor
    const existingPatient = await db.patient.findFirst({
      where: {
        id: patientId,
        doctorId,
      },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Delete the patient
    await db.patient.delete({
      where: { id: patientId },
    });

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
