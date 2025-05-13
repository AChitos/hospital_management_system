"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/helpers";
import { api } from "@/lib/utils/apiClient";

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
  doctor?: {
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        // First, we need to get all prescriptions and filter by ID client-side
        // This is a workaround until we update our API routes to be more consistent
        const response = await api.get<Prescription[]>('/api/prescriptions');
        
        if (response.error) {
          setError(response.error);
          setIsLoading(false);
          return;
        }
        
        if (response.data) {
          const foundPrescription = response.data.find(p => p.id === prescriptionId);
          if (foundPrescription) {
            setPrescription(foundPrescription);
          } else {
            setError('Prescription not found');
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching prescription data:", error);
        setError(error instanceof Error ? error.message : "Failed to load prescription");
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

  if (error) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading prescription: {error}
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => router.back()} className="flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (!prescription) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Prescription not found</p>
          </div>
          <Button onClick={() => router.back()} className="flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mr-2">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Prescription Details</h1>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {prescription.medication}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {isPrescriptionActive(prescription) 
                      ? <span className="text-green-600">Active</span> 
                      : <span className="text-red-600">Expired</span>}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/prescriptions/${prescription.id}/edit`}>
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Dosage</h3>
                    <p>{prescription.dosage}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Frequency</h3>
                    <p>{prescription.frequency}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                    <p>{prescription.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Issued Date</h3>
                    <p>{formatDate(prescription.issuedDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                    <p>{prescription.expiryDate ? formatDate(prescription.expiryDate) : "Not specified"}</p>
                  </div>
                </div>
                {prescription.notes && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="whitespace-pre-wrap">{prescription.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
                  <Link href={`/patients/${prescription.patient.id}`} className="text-blue-600 hover:text-blue-800">
                    {prescription.patient.firstName} {prescription.patient.lastName}
                  </Link>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Prescribed By</h3>
                  <p>
                    {prescription.doctor ? 
                      `Dr. ${prescription.doctor.firstName} ${prescription.doctor.lastName}` : 
                      "Not assigned"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-start border-t pt-4">
                <Button variant="outline" asChild>
                  <Link href={`/patients/${prescription.patient.id}`}>
                    View Patient Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
