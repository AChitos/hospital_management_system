import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> } 
) {
  const { appointmentId } = await params;
  
  try {
    return NextResponse.json({ 
      id: appointmentId,
      patient: { id: "1", firstName: "John", lastName: "Doe" },
      appointmentDate: "2025-05-20T10:00:00Z",
      status: "SCHEDULED",
      notes: "Regular checkup"
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  
  try {
    const data = await request.json();
    
    return NextResponse.json({ 
      id: appointmentId,
      ...data,
      status: data.status || "SCHEDULED",
      updatedAt: new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    return NextResponse.json({ 
      message: "Appointment deleted successfully" 
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
