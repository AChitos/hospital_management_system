"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/helpers";

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  issuedDate: string;
  expiryDate?: string;
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

export default function PrescriptionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const prescriptionId = params.prescriptionId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [prescription, setPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        // In a real app, we'd fetch from an API endpoint
        // For now using mock data
        setTimeout(() => {
          // Mock prescription data
          setPrescription({
            id: prescriptionId,
            medication: "Propofol",
            dosage: "10mg/ml",
            frequency: "As needed",
            duration: "Single use",
            notes: "For induction of general anesthesia",
            issuedDate: "2025-05-10T09:00:00Z",
            expiryDate: "2025-06-10T09:00:00Z",
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
        console.error("Error fetching prescription data:", error);
        setIsLoading(false);
      }
    };

    if (prescriptionId) {
      fetchPrescriptionData();
    }
  }, [prescriptionId]);

  const isPrescriptionActive = (prescription: Prescription) => {
    if (!prescription.expiryDate) return true;
    return new Date(prescription.expiryDate) > new Date();
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading prescription information...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!prescription) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">Prescription not found</p>
            <Button onClick={() => router.push("/prescriptions")}>
              Return to Prescriptions List
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
              <Link href="/prescriptions" className="mr-4">
                <Button variant="outline" size="icon">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">
                Prescription: {prescription.medication}
              </h1>
            </div>
            <div className="flex space-x-2">
              <Link href={`/prescriptions/new?duplicate=${prescriptionId}`}>
                <Button variant="outline">
                  <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </Link>
              <Link href={`/prescriptions/${prescriptionId}/edit`}>
                <Button>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Prescription
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Main Prescription Info */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Prescription Details</CardTitle>
                <span className={`inline-block px-2 py-1 text-xs rounded 
                  ${isPrescriptionActive(prescription) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {isPrescriptionActive(prescription) ? "Active" : "Expired"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Medication</p>
                  <p className="font-medium">{prescription.medication}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dosage</p>
                  <p className="font-medium">{prescription.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frequency</p>
                  <p>{prescription.frequency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p>{prescription.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issued Date</p>
                  <p>{formatDate(prescription.issuedDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p>{prescription.expiryDate ? formatDate(prescription.expiryDate) : "Not specified"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p>{prescription.notes || "No notes available"}</p>
                </div>
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
                    <Link href={`/patients/${prescription.patient.id}`} className="text-blue-600 hover:text-blue-800">
                      {prescription.patient.firstName} {prescription.patient.lastName}
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prescribed By</p>
                  <p>
                    Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Print Prescription */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={() => window.print()}>
                Print Prescription
              </Button>
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(
                `Medication: ${prescription.medication}\n` +
                `Dosage: ${prescription.dosage}\n` +
                `Frequency: ${prescription.frequency}\n` +
                `Duration: ${prescription.duration}\n` +
                `Notes: ${prescription.notes || "None"}\n` +
                `Prescribed by: Dr. ${prescription.doctor.firstName} ${prescription.doctor.lastName}`
              )}>
                Copy to Clipboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
