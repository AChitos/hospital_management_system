"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/utils/apiClient";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

interface PrescriptionFormData {
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  expiryDate?: string;
}

export default function NewPrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientIdFromUrl = searchParams.get("patientId");
  
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PrescriptionFormData>({
    defaultValues: {
      patientId: patientIdFromUrl || "",
    },
  });

  // Fetch patients for selection
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get<Patient[]>('/api/patients');
        
        if (response.error) {
          console.error("Error fetching patients:", response.error);
          return;
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

  const onSubmit = async (data: PrescriptionFormData) => {
    setIsLoading(true);
    
    try {
      // Send the data to our API
      const response = await api.post<any>(`/api/patients/${data.patientId}/prescriptions`, data);
      
      if (response.error) {
        console.error("Error creating prescription:", response.error);
        setIsLoading(false);
        return;
      }
      
      // Redirect to prescriptions page on success
      router.push("/prescriptions");
    } catch (error) {
      console.error("Error creating prescription:", error);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center">
            <Link href="/prescriptions" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create New Prescription</h1>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
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

              <div>
                <Label htmlFor="medication">Medication</Label>
                <Input
                  id="medication"
                  placeholder="Enter medication name"
                  {...register("medication", { required: "Medication name is required" })}
                />
                {errors.medication && (
                  <p className="text-red-500 text-sm mt-1">{errors.medication.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 10mg/ml"
                    {...register("dosage", { required: "Dosage is required" })}
                  />
                  {errors.dosage && (
                    <p className="text-red-500 text-sm mt-1">{errors.dosage.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g., Once daily"
                    {...register("frequency", { required: "Frequency is required" })}
                  />
                  {errors.frequency && (
                    <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 7 days"
                    {...register("duration", { required: "Duration is required" })}
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    {...register("expiryDate")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <textarea
                  id="notes"
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  placeholder="Add any additional notes about this prescription"
                  {...register("notes")}
                ></textarea>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-4">
              <Link href="/prescriptions">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Prescription"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthLayout>
  );
}
