import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/utils/db';

// GET all appointments for a doctor
export async function GET(request: NextRequest) {
  try {
    const doctorId = request.headers.get('X-User-ID');

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');
    const status = url.searchParams.get('status');
    
    // Build the where clause
    const where: any = {};
    
    // If patientId is provided, add it to the where clause
    if (patientId) {
      where.patientId = patientId;
    } else {
      // If no patientId is provided, get all appointments for patients of this doctor
      where.patient = {
        doctorId
      };
    }
    
    // If status is provided, add it to the where clause
    if (status) {
      where.status = status;
    }
    
    const appointments = await db.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { appointmentDate: 'asc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new appointment
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
    const { patientId, appointmentDate, notes } = body;

    if (!patientId || !appointmentDate) {
      return NextResponse.json(
        { error: 'Patient ID and appointment date are required' },
        { status: 400 }
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

    const appointment = await db.appointment.create({
      data: {
        appointmentDate: new Date(appointmentDate),
        notes,
        patientId,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
