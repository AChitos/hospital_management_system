"use server";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyToken } from '@/lib/auth/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { prescriptionId: string } }
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
    const prescriptionId = params.prescriptionId;
    const prisma = new PrismaClient();
    
    try {
      // Get the prescription by ID
      const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              doctorId: true
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

      if (!prescription) {
        return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
      }

      // Verify the doctor has access to this patient
      if (prescription.patient.doctorId !== doctorId) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
      }

      return NextResponse.json(prescription);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
