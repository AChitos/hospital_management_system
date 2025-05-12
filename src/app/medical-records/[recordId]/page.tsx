"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/helpers";

interface MedicalRecord {
  id: string;
  recordDate: string;
  diagnosis: string;
  symptoms?: string;
  vitalSigns?: string;
  notes?: string;
  treatmentPlan?: string;
  followUpDate?: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function MedicalRecordDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.recordId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    const fetchMedicalRecordData = async () => {
      try {
        // In a real app, we'd fetch from an API endpoint
        // For now using mock data
        setTimeout(() => {
          // Mock medical record data
          setMedicalRecord({
            id: recordId,
            recordDate: "2025-05-10T09:00:00Z",
            diagnosis: "Hypertension",
            symptoms: "Headache, dizziness, occasional chest discomfort",
            vitalSigns: "BP: 150/95, HR: 88, RR: 16, Temp: 37.1°C",
            notes: "Patient presented with elevated blood pressure readings over the past month. Reports increased stress at work and irregular sleep patterns.",
            treatmentPlan: "1. Prescribed Lisinopril 10mg once daily\n2. Recommended sodium-restricted diet\n3. Daily exercise minimum 30 minutes\n4. Stress reduction techniques discussed",
            followUpDate: "2025-06-10T09:00:00Z",
            patient: {
              id: "1",
              firstName: "John",
              lastName: "Doe",
            },
            doctor: {
              id: "doctor-1",
              firstName: "Jane",
              lastName: "Smith",
            }
          });
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching medical record data:", error);
        setIsLoading(false);
      }
    };

    if (recordId) {
      fetchMedicalRecordData();
    }
  }, [recordId]);

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading medical record information...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!medicalRecord) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">Medical record not found</p>
            <Button onClick={() => router.push("/medical-records")}>
              Return to Medical Records List
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/medical-records" className="mr-4">
                <Button variant="outline" size="icon">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">
                Medical Record: {medicalRecord.diagnosis}
              </h1>
            </div>
            <div className="flex space-x-2">
              <Link href={`/medical-records/${recordId}/edit`}>
                <Button>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Record
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Main Medical Record Info */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Medical Record Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Record Date</p>
                  <p className="font-medium">{formatDate(medicalRecord.recordDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Follow-up Date</p>
                  <p className="font-medium">{medicalRecord.followUpDate ? formatDate(medicalRecord.followUpDate) : "Not scheduled"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Diagnosis</p>
                  <p className="font-medium">{medicalRecord.diagnosis}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Vital Signs</p>
                <p>{medicalRecord.vitalSigns || "Not recorded"}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Symptoms</p>
                <p>{medicalRecord.symptoms || "None reported"}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Clinical Notes</p>
                <p className="whitespace-pre-line">{medicalRecord.notes || "No additional notes"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Treatment Plan</p>
                <p className="whitespace-pre-line">{medicalRecord.treatmentPlan || "No treatment plan specified"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Patient Info */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p>
                    <Link href={`/patients/${medicalRecord.patient.id}`} className="text-blue-600 hover:text-blue-800">
                      {medicalRecord.patient.firstName} {medicalRecord.patient.lastName}
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Attending Physician</p>
                  <p>
                    Dr. {medicalRecord.doctor.firstName} {medicalRecord.doctor.lastName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={() => window.print()}>
                Print Medical Record
              </Button>
              <Link href={`/prescriptions/new?patientId=${medicalRecord.patient.id}`}>
                <Button variant="outline">
                  Create Prescription
                </Button>
              </Link>
              <Link href={`/appointments/new?patientId=${medicalRecord.patient.id}`}>
                <Button variant="outline">
                  Schedule Follow-up
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
