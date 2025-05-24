"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils/helpers";
import { api } from "@/lib/utils/apiClient";

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
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<MedicalRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await api.get<MedicalRecord[]>('/api/medical-records');
        
        if (response.error) {
          setError(response.error);
          setIsLoading(false);
          return;
        }
        
        if (response.data) {
          setMedicalRecords(response.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        setIsLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  const handleDeleteClick = (record: MedicalRecord) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const response = await api.delete(`/api/medical-records/${recordToDelete.id}`);
      
      if (response.data) {
        setMedicalRecords(medicalRecords.filter(record => record.id !== recordToDelete.id));
        setDeleteDialogOpen(false);
        setRecordToDelete(null);
      } else {
        console.error("Error deleting medical record:", response.error);
        alert("Failed to delete medical record. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting medical record:", error);
      alert("Failed to delete medical record. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

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

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading medical records: {error}
                </p>
              </div>
            </div>
          </div>
        )}

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
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteClick(record)}
                          className="ml-2"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Medical Record</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this medical record? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="mr-2"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthLayout>
  );
}
