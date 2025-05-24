"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon, CalendarIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils/helpers";
import { api } from "@/lib/utils/apiClient";

interface Appointment {
  id: string;
  appointmentDate: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
  notes?: string;
}

export default function AppointmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get<Appointment[]>('/api/appointments');
        
        if (response.error) {
          setError(response.error);
          setIsLoading(false);
          return;
        }
        
        if (response.data) {
          setAppointments(response.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments");
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDeleteClick = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const response = await api.delete(`/api/appointments/${appointmentToDelete.id}`);
      
      if (response.data) {
        setAppointments(appointments.filter(appointment => appointment.id !== appointmentToDelete.id));
        setDeleteDialogOpen(false);
        setAppointmentToDelete(null);
      } else {
        console.error("Error deleting appointment:", response.error);
        alert("Failed to delete appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return patientName.includes(query) || 
           (appointment.notes && appointment.notes.toLowerCase().includes(query));
  });

  // Group appointments by status
  const scheduledAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === "SCHEDULED"
  );
  
  const completedAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === "COMPLETED"
  );
  
  const cancelledAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  );

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <div className="flex space-x-2">
            <Link href="/calendar">
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
            </Link>
            <Link href="/appointments/new">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading appointments: {error}
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
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter options could go here */}
          </div>
        </Card>

        <div className="space-y-8">
          {/* Scheduled appointments */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Scheduled Appointments</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          Loading appointments...
                        </td>
                      </tr>
                    ) : scheduledAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No scheduled appointments
                        </td>
                      </tr>
                    ) : (
                      scheduledAppointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span>{formatDate(appointment.appointmentDate, true)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/patients/${appointment.patient.id}`} className="text-blue-600 hover:text-blue-800">
                              {appointment.patient.firstName} {appointment.patient.lastName}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {appointment.notes || "-"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/appointments/${appointment.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                            >
                              Details
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(appointment)}
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
          </div>

          {/* Completed appointments */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Completed Appointments</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          Loading appointments...
                        </td>
                      </tr>
                    ) : completedAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No completed appointments
                        </td>
                      </tr>
                    ) : (
                      completedAppointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span>{formatDate(appointment.appointmentDate, true)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/patients/${appointment.patient.id}`} className="text-blue-600 hover:text-blue-800">
                              {appointment.patient.firstName} {appointment.patient.lastName}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {appointment.notes || "-"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/appointments/${appointment.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                            >
                              Details
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(appointment)}
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
          </div>
          
          {/* Cancelled appointments */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Cancelled Appointments</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          Loading appointments...
                        </td>
                      </tr>
                    ) : cancelledAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No cancelled appointments
                        </td>
                      </tr>
                    ) : (
                      cancelledAppointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span>{formatDate(appointment.appointmentDate, true)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/patients/${appointment.patient.id}`} className="text-blue-600 hover:text-blue-800">
                              {appointment.patient.firstName} {appointment.patient.lastName}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {appointment.notes || "-"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/appointments/${appointment.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                            >
                              Details
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(appointment)}
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
          </div>
        </div>

        {/* Delete appointment confirmation dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this appointment? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end p-4">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Appointment"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthLayout>
  );
}
