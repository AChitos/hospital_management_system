"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon, XCircleIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/helpers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"cancel" | "complete">("cancel");

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        // In a real app, we'd fetch from an API endpoint
        // For now using mock data
        setTimeout(() => {
          // Mock appointment data
          setAppointment({
            id: appointmentId,
            appointmentDate: "2025-05-15T09:00:00Z", // Future date
            status: "SCHEDULED",
            patient: {
              id: "1",
              firstName: "John",
              lastName: "Doe",
            },
            notes: "Follow-up appointment to discuss anesthesia options",
          });
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching appointment data:", error);
        setIsLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentData();
    }
  }, [appointmentId]);

  const handleStatusChange = async (newStatus: "COMPLETED" | "CANCELLED") => {
    setIsDialogOpen(false);
    
    try {
      // In a real app, we'd update via API
      console.log(`Updating appointment ${appointmentId} status to ${newStatus}`);
      
      // Update local state
      if (appointment) {
        setAppointment({ ...appointment, status: newStatus });
      }
      
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Error updating appointment status:`, error);
    }
  };

  const openDialog = (type: "cancel" | "complete") => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading appointment information...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!appointment) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">Appointment not found</p>
            <Button onClick={() => router.push("/appointments")}>
              Return to Appointments List
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
              <Link href="/appointments" className="mr-4">
                <Button variant="outline" size="icon">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">
                Appointment Details
              </h1>
            </div>
            <div className="flex space-x-2">
              <Link href={`/appointments/${appointmentId}/edit`}>
                <Button variant="outline">
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Appointment
                </Button>
              </Link>
              {appointment.status === "SCHEDULED" && (
                <>
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => openDialog("cancel")}
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => openDialog("complete")}
                  >
                    Complete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Appointment Information</CardTitle>
              <span className={`inline-block px-2 py-1 text-xs rounded 
                ${appointment.status === "SCHEDULED" ? "bg-blue-100 text-blue-800" : 
                appointment.status === "COMPLETED" ? "bg-green-100 text-green-800" : 
                "bg-red-100 text-red-800"}`}
              >
                {appointment.status}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium">
                  <Link href={`/patients/${appointment.patient.id}`} className="text-blue-600 hover:text-blue-800">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </Link>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{formatDate(appointment.appointmentDate, true)}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm text-gray-500">Notes</p>
                <p>{appointment.notes || "No notes available"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional sections could go here - e.g., appointment history, related records */}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "cancel" ? "Cancel Appointment" : "Complete Appointment"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to {dialogType === "cancel" ? "cancel" : "mark as completed"} 
              this appointment with {appointment.patient.firstName} {appointment.patient.lastName}?
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              No, Go Back
            </Button>
            <Button 
              variant={dialogType === "cancel" ? "destructive" : "default"}
              onClick={() => handleStatusChange(dialogType === "cancel" ? "CANCELLED" : "COMPLETED")}
            >
              Yes, {dialogType === "cancel" ? "Cancel" : "Complete"} Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
}
