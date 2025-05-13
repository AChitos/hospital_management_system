"use server";

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/utils/db';
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
    
    // Get the prescription by ID
    const prescription = await db.prescription.findUnique({
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

      // Verify the doctor has access to this prescription
      if (prescription.doctorId !== doctorId && prescription.patient.doctorId !== doctorId) {
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

export async function PATCH(
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
      // First verify the doctor has access to this prescription
      const existingPrescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
          patient: {
            select: {
              doctorId: true
            }
          }
        }
      });

      if (!existingPrescription) {
        return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
      }

      // Verify the doctor has access to this prescription
      if (existingPrescription.doctorId !== doctorId && existingPrescription.patient.doctorId !== doctorId) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
      }

      // Get the data from the request body
      const data = await request.json();
      
      // Update the prescription
      const updatedPrescription = await prisma.prescription.update({
        where: { id: prescriptionId },
        data: {
          medication: data.medication,
          dosage: data.dosage,
          frequency: data.frequency,
          duration: data.duration,
          notes: data.notes || null,
          issuedDate: data.issuedDate ? new Date(data.issuedDate) : undefined,
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true
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

      return NextResponse.json(updatedPrescription);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error updating prescription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
