"use server";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyToken } from '@/lib/auth/auth';

// GET all prescriptions for a patient
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
    const patientId = params.patientId;
    const prisma = new PrismaClient();
    
    try {
      // Check if the patient belongs to the doctor
      const patient = await prisma.patient.findFirst({
        where: {
          id: patientId,
          doctorId
        }
      });

      if (!patient) {
        return NextResponse.json({ error: 'Patient not found or access denied' }, { status: 404 });
      }

      // Get all prescriptions for the patient
      const prescriptions = await prisma.prescription.findMany({
        where: { patientId },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json(prescriptions);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new prescription for a patient
export async function POST(
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
    const patientId = params.patientId;
    const data = await request.json();
    const prisma = new PrismaClient();
    
    try {
      // Check if the patient belongs to the doctor
      const patient = await prisma.patient.findFirst({
        where: {
          id: patientId,
          doctorId
        }
      });

      if (!patient) {
        return NextResponse.json({ error: 'Patient not found or access denied' }, { status: 404 });
      }

      // Create new prescription
      const newPrescription = await prisma.prescription.create({
        data: {
          patientId,
          doctorId,
          medication: data.medication,
          dosage: data.dosage,
          frequency: data.frequency,
          duration: data.duration,
          notes: data.notes || '',
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
        },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      return NextResponse.json(newPrescription);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
