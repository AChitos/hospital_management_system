"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/helpers";

interface MedicalRecord {
  id: string;
  recordDate: string;
  diagnosis: string;
  symptoms?: string;
  notes?: string;
  vitalSigns?: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function MedicalRecordsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        // In a real app, we would fetch from the API
        // For now, using mock data
        setTimeout(() => {
          const mockRecords = [
            {
              id: "1",
              recordDate: "2025-05-10T09:00:00Z",
              diagnosis: "Hypertension",
              symptoms: "Headache, dizziness",
              vitalSigns: "BP: 150/95, HR: 88, RR: 16, Temp: 37.1°C",
              patient: {
                id: "1",
                firstName: "John",
                lastName: "Doe",
              },
            },
            {
              id: "2",
              recordDate: "2025-05-09T10:30:00Z",
              diagnosis: "Upper Respiratory Infection",
              symptoms: "Cough, sore throat, congestion",
              vitalSigns: "BP: 120/80, HR: 76, RR: 18, Temp: 37.8°C",
              patient: {
                id: "2",
                firstName: "Jane",
                lastName: "Smith",
              },
            },
            {
              id: "3",
              recordDate: "2025-05-08T14:00:00Z",
              diagnosis: "Lower Back Pain",
              symptoms: "Pain radiating to right leg, limited mobility",
              vitalSigns: "BP: 130/85, HR: 72, RR: 14, Temp: 36.9°C",
              patient: {
                id: "3",
                firstName: "Michael",
                lastName: "Johnson",
              },
            },
            {
              id: "4",
              recordDate: "2025-05-07T11:15:00Z",
              diagnosis: "Anxiety Disorder",
              symptoms: "Restlessness, insomnia, racing thoughts",
              vitalSigns: "BP: 125/82, HR: 96, RR: 20, Temp: 37.0°C",
              patient: {
                id: "4",
                firstName: "Emily",
                lastName: "Williams",
              },
            },
            {
              id: "5",
              recordDate: "2025-05-06T15:30:00Z",
              diagnosis: "Type 2 Diabetes",
              symptoms: "Increased thirst, frequent urination",
              vitalSigns: "BP: 135/88, HR: 78, RR: 16, Temp: 36.8°C",
              patient: {
                id: "5",
                firstName: "Robert",
                lastName: "Brown",
              },
            },
          ] as MedicalRecord[];
          
          setMedicalRecords(mockRecords);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        setIsLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  // Filter medical records based on search query
  const filteredRecords = medicalRecords.filter((record) => {
    const patientName = `${record.patient.firstName} ${record.patient.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return patientName.includes(query) || 
           record.diagnosis.toLowerCase().includes(query) ||
           (record.symptoms && record.symptoms.toLowerCase().includes(query));
  });

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Medical Records</h1>
          <Link href="/medical-records/new">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Medical Record
            </Button>
          </Link>
        </div>

        <Card className="mb-6 p-4">
          <div className="flex items-center">
            <div className="relative w-full md:w-1/3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
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
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symptoms
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Loading medical records...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No medical records found
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {formatDate(record.recordDate)}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/patients/${record.patient.id}`} className="text-blue-600 hover:text-blue-800">
                          {record.patient.firstName} {record.patient.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {record.diagnosis}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {record.symptoms || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/medical-records/${record.id}`}
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
