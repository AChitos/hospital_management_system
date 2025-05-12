"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon, CalendarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/helpers";

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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // In a real app, we would fetch from the API
        // For now, using mock data
        setTimeout(() => {
          const mockAppointments = [
            {
              id: "1",
              appointmentDate: "2025-05-20T09:00:00Z", // Future appointment
              status: "SCHEDULED",
              patient: {
                id: "1",
                firstName: "John",
                lastName: "Doe",
              },
              notes: "Follow-up appointment",
            },
            {
              id: "2",
              appointmentDate: "2025-05-13T10:30:00Z", // Tomorrow's appointment
              status: "SCHEDULED",
              patient: {
                id: "2",
                firstName: "Jane",
                lastName: "Smith",
              },
              notes: "Pre-op assessment",
            },
            {
              id: "3",
              appointmentDate: "2025-05-12T14:00:00Z", // Today's appointment (already marked as completed)
              status: "COMPLETED",
              patient: {
                id: "3",
                firstName: "Michael",
                lastName: "Johnson",
              },
              notes: "Anesthesia consultation",
            },
            {
              id: "4",
              appointmentDate: "2025-05-10T11:15:00Z",
              status: "CANCELLED",
              patient: {
                id: "4",
                firstName: "Emily",
                lastName: "Williams",
              },
              notes: "Patient requested rescheduling",
            },
            {
              id: "5",
              appointmentDate: "2025-05-16T15:30:00Z",
              status: "SCHEDULED",
              patient: {
                id: "5",
                firstName: "Robert",
                lastName: "Brown",
              },
              notes: "Initial consultation",
            },
          ] as Appointment[];
          
          setAppointments(mockAppointments);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return patientName.includes(query) || 
           appointment.status.toLowerCase().includes(query) ||
           (appointment.notes && appointment.notes.toLowerCase().includes(query));
  });

  // Helper function to get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <Link href="/appointments/new">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </Link>
        </div>

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

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Loading appointments...
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {formatDate(appointment.appointmentDate, true)}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/patients/${appointment.patient.id}`} className="text-blue-600 hover:text-blue-800">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusStyle(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {appointment.notes || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/appointments/${appointment.id}`}
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
