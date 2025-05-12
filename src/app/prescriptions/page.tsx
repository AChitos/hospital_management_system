"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/helpers";

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  issuedDate: string;
  expiryDate?: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function PrescriptionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // In a real app, we would fetch from the API
        // For now, using mock data
        setTimeout(() => {
          const mockPrescriptions = [
            {
              id: "1",
              medication: "Propofol",
              dosage: "10mg/ml",
              frequency: "As needed",
              duration: "Single use",
              issuedDate: "2025-05-10T09:00:00Z",
              patient: {
                id: "1",
                firstName: "John",
                lastName: "Doe",
              },
            },
            {
              id: "2",
              medication: "Fentanyl",
              dosage: "50mcg/ml",
              frequency: "As needed",
              duration: "Single use",
              issuedDate: "2025-05-09T10:30:00Z",
              patient: {
                id: "2",
                firstName: "Jane",
                lastName: "Smith",
              },
            },
            {
              id: "3",
              medication: "Midazolam",
              dosage: "1mg/ml",
              frequency: "As needed",
              duration: "Single use",
              issuedDate: "2025-05-08T14:00:00Z",
              patient: {
                id: "3",
                firstName: "Michael",
                lastName: "Johnson",
              },
            },
            {
              id: "4",
              medication: "Morphine",
              dosage: "10mg/ml",
              frequency: "Every 4 hours",
              duration: "72 hours",
              issuedDate: "2025-05-07T11:15:00Z",
              expiryDate: "2025-05-10T11:15:00Z",
              patient: {
                id: "4",
                firstName: "Emily",
                lastName: "Williams",
              },
            },
            {
              id: "5",
              medication: "Lidocaine",
              dosage: "2%",
              frequency: "As needed",
              duration: "Single use",
              issuedDate: "2025-05-06T15:30:00Z",
              patient: {
                id: "5",
                firstName: "Robert",
                lastName: "Brown",
              },
            },
          ] as Prescription[];
          
          setPrescriptions(mockPrescriptions);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Filter prescriptions based on search query
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const patientName = `${prescription.patient.firstName} ${prescription.patient.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return patientName.includes(query) || 
           prescription.medication.toLowerCase().includes(query) ||
           prescription.dosage.toLowerCase().includes(query);
  });

  // Check if prescription is active (not expired)
  const isPrescriptionActive = (prescription: Prescription) => {
    if (!prescription.expiryDate) return true;
    return new Date(prescription.expiryDate) > new Date();
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Prescriptions</h1>
          <Link href="/prescriptions/new">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          </Link>
        </div>

        <Card className="mb-6 p-4">
          <div className="flex items-center">
            <div className="relative w-full md:w-1/3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter options could go here */}
          </div>
        </Card>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issued Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Loading prescriptions...
                    </td>
                  </tr>
                ) : filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No prescriptions found
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {prescription.medication}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/patients/${prescription.patient.id}`} className="text-blue-600 hover:text-blue-800">
                          {prescription.patient.firstName} {prescription.patient.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {prescription.dosage}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {formatDate(prescription.issuedDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          isPrescriptionActive(prescription) 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                        }`}>
                          {isPrescriptionActive(prescription) ? "Active" : "Expired"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/prescriptions/${prescription.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
