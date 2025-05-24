"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/helpers";
import { api } from "@/lib/utils/apiClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<Prescription | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await api.get<Prescription[]>('/api/prescriptions');
        
        if (response.error) {
          setError(response.error);
          setIsLoading(false);
          return;
        }
        
        if (response.data) {
          setPrescriptions(response.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setError(error instanceof Error ? error.message : "Failed to load prescriptions");
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

  const handleDeleteClick = (prescription: Prescription) => {
    setPrescriptionToDelete(prescription);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!prescriptionToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const response = await api.delete(`/api/prescriptions/${prescriptionToDelete.id}`);
      
      if (response.error) {
        console.error("Error deleting prescription:", response.error);
        setIsDeleting(false);
        return;
      }
      
      // Remove the deleted prescription from the list
      setPrescriptions(prev => prev.filter(p => p.id !== prescriptionToDelete.id));
      setDeleteDialogOpen(false);
      setPrescriptionToDelete(null);
      setIsDeleting(false);
    } catch (error) {
      console.error("Error deleting prescription:", error);
      setIsDeleting(false);
    }
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

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading prescriptions: {error}
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
                placeholder="Search prescriptions..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter options could go here */}
          </div>
        </Card>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
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
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issued Date
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
                      <td className="px-6 py-4 font-medium">
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
                        {prescription.frequency}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {formatDate(prescription.issuedDate)}
                        {prescription.expiryDate && (
                          <div className="text-xs text-gray-500">
                            Expires: {formatDate(prescription.expiryDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/prescriptions/${prescription.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Details
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(prescription)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prescription</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {prescriptionToDelete && (
              <p>
                Are you sure you want to delete the prescription for{" "}
                <strong>{prescriptionToDelete.medication}</strong> prescribed to{" "}
                <strong>
                  {prescriptionToDelete.patient.firstName} {prescriptionToDelete.patient.lastName}
                </strong>? This action cannot be undone.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Prescription"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
}
