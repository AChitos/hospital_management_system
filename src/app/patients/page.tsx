"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/helpers";
import { api } from "@/lib/utils/apiClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber?: string;
  email?: string;
  updatedAt: string;
}

export default function PatientsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        
        // Fetch patients from the API
        const response = await api.get<Patient[]>('/api/patients');
        
        if (response.data) {
          setPatients(response.data);
        } else {
          console.error("Error fetching patients:", response.error);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.contactNumber?.includes(searchQuery)
  );

  const handleDeleteClick = (patient: Patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const response = await api.delete(`/api/patients/${patientToDelete.id}`);
      
      if (response.error) {
        console.error("Error deleting patient:", response.error);
        setIsDeleting(false);
        return;
      }
      
      // Remove the deleted patient from the list
      setPatients(prev => prev.filter(p => p.id !== patientToDelete.id));
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
      setIsDeleting(false);
    } catch (error) {
      console.error("Error deleting patient:", error);
      setIsDeleting(false);
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto border-4 border-t-blue-600 border-b-gray-200 border-l-gray-200 border-r-gray-200 rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-500">Loading patients...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Patients</h1>
            <p className="text-gray-500">Manage your patient records</p>
          </div>
          <div>
            <Link href="/patients/new">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link href={`/patients/${patient.id}`} className="text-blue-600 hover:text-blue-800">
                          {patient.firstName} {patient.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{patient.gender}</td>
                      <td className="px-6 py-4 text-gray-700">{calculateAge(patient.dateOfBirth)}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {patient.contactNumber || patient.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                        {formatDate(new Date(patient.updatedAt))}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Details
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(patient)}
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
            <DialogTitle>Delete Patient</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {patientToDelete && (
              <p>
                Are you sure you want to delete the patient{" "}
                <strong>
                  {patientToDelete.firstName} {patientToDelete.lastName}
                </strong>? This will also delete all associated medical records, prescriptions, and appointments. This action cannot be undone.
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
              {isDeleting ? "Deleting..." : "Delete Patient"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
}
