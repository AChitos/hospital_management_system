import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/utils/db';

// GET all patients for the logged-in doctor
export async function GET(request: NextRequest) {
  try {
    const doctorId = request.headers.get('X-User-ID');

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const patients = await db.patient.findMany({
      where: { doctorId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new patient
export async function POST(request: NextRequest) {
  try {
    const doctorId = request.headers.get('X-User-ID');

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, dateOfBirth, gender, contactNumber, email, address, bloodType, allergies } = body;

    if (!firstName || !lastName || !dateOfBirth || !gender) {
      return NextResponse.json(
        { error: 'First name, last name, date of birth, and gender are required' },
        { status: 400 }
      );
    }

    const patient = await db.patient.create({
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
        doctorId,
      }
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
