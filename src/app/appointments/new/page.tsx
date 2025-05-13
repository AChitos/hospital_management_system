"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeftIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils/helpers";
import { api } from "@/lib/utils/apiClient";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

interface AppointmentFormData {
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}

export default function AppointmentSchedulingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormData>();

  // Fetch patients for selection
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get<Patient[]>('/api/patients');
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (response.data) {
          setPatients(response.data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const onSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true);
    
    try {
      // Combine date and time
      const combinedDateTime = new Date(`${data.appointmentDate}T${data.appointmentTime}:00`);
      
      // Send data to the API using the api client
      const response = await api.post('/api/appointments', {
        patientId: data.patientId,
        appointmentDate: combinedDateTime.toISOString(),
        notes: data.notes,
        status: 'SCHEDULED'
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setIsLoading(false);
      router.push("/appointments");
      
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setIsLoading(false);
    }
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  // Default appointment hours (8 AM - 5 PM, 30 min intervals)
  const appointmentHours = [];
  for (let hour = 8; hour < 17; hour++) {
    appointmentHours.push(`${hour.toString().padStart(2, "0")}:00`);
    appointmentHours.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center">
            <Link href="/appointments" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Schedule New Appointment</h1>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patientId">Patient</Label>
                <select
                  id="patientId"
                  className="w-full p-2 border rounded-md"
                  {...register("patientId", { required: "Please select a patient" })}
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appointmentDate">Date</Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    min={today}
                    {...register("appointmentDate", { required: "Date is required" })}
                  />
                  {errors.appointmentDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.appointmentDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="appointmentTime">Time</Label>
                  <select
                    id="appointmentTime"
                    className="w-full p-2 border rounded-md"
                    {...register("appointmentTime", { required: "Time is required" })}
                  >
                    <option value="">Select Time</option>
                    {appointmentHours.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.appointmentTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.appointmentTime.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter any notes about this appointment"
                  {...register("notes")}
                ></textarea>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-4">
              <Link href="/appointments">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthLayout>
  );
}
