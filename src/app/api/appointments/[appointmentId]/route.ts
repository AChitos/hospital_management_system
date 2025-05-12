import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/utils/db';

// GET a specific appointment
export async function GET(
  request: NextRequest,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const doctorId = request.headers.get('X-User-ID');
    const { appointmentId } = params;

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            doctorId: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Verify that the appointment's patient belongs to the doctor
    if (appointment.patient.doctorId !== doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE a specific appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const doctorId = request.headers.get('X-User-ID');
    const { appointmentId } = params;

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the appointment exists and patient belongs to doctor
    const existingAppointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: {
            doctorId: true,
          },
        },
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    if (existingAppointment.patient.doctorId !== doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { appointmentDate, status, notes } = body;

    if (!appointmentDate || !status) {
      return NextResponse.json(
        { error: 'Appointment date and status are required' },
        { status: 400 }
      );
    }

    const updatedAppointment = await db.appointment.update({
      where: { id: appointmentId },
      data: {
        appointmentDate: new Date(appointmentDate),
        status,
        notes,
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a specific appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const doctorId = request.headers.get('X-User-ID');
    const { appointmentId } = params;

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the appointment exists and patient belongs to doctor
    const existingAppointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: {
            doctorId: true,
          },
        },
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    if (existingAppointment.patient.doctorId !== doctorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the appointment
    await db.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
