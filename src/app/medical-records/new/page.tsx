"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Select from 'react-select';
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

interface PatientOption {
  value: string;
  label: string;
}

interface MedicalRecordFormData {
  patientId: string;
  recordDate: string;
  diagnosis: string;
  symptoms?: string;
  vitalSigns?: string;
  notes?: string;
  treatmentPlan?: string;
  followUpDate?: string;
}

export default function NewMedicalRecordPage() {
  const router = useRouter();
  
  // State to store URL parameters - retrieved safely on client side
  const [patientIdFromUrl, setPatientIdFromUrl] = useState<string | null>(null);
  
  // Get URL parameters on client-side only
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const patientId = searchParams.get("patientId");
    setPatientIdFromUrl(patientId);
  }, []);
  
  const [isLoading, setIsLoading] = useState(false);
  const [patientOptions, setPatientOptions] = useState<PatientOption[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MedicalRecordFormData>({
    defaultValues: {
      recordDate: new Date().toISOString().split("T")[0],
    },
  });
  
  // Update the form value when the URL param is loaded
  useEffect(() => {
    if (patientIdFromUrl) {
      setValue("patientId", patientIdFromUrl);
    }
  }, [patientIdFromUrl, setValue]);

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
          // Convert patients to options format for react-select
          const options = response.data.map(patient => ({
            value: patient.id,
            label: `${patient.firstName} ${patient.lastName}`
          }));
          
          setPatientOptions(options);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const onSubmit = async (data: MedicalRecordFormData) => {
    setIsLoading(true);
    
    try {
      // Send the data to our API
      const response = await api.post(`/api/patients/${data.patientId}/medical-records`, data);
      
      if (response.error) {
        console.error("Error creating medical record:", response.error);
        setIsLoading(false);
        return;
      }
      
      // Redirect to medical records page on success
      router.push("/medical-records");
    } catch (error) {
      console.error("Error creating medical record:", error);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center">
            <Link href="/medical-records" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create New Medical Record</h1>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Medical Record Details</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientId">Patient</Label>
                  <Controller
                    name="patientId"
                    control={control}
                    rules={{ required: "Please select a patient" }}
                    render={({ field }) => (
                      <Select
                        inputId="patientId"
                        options={patientOptions}
                        placeholder="Search for patient by name..."
                        isClearable
                        className="react-select"
                        classNamePrefix="react-select"
                        value={patientOptions.find(option => option.value === field.value) || null}
                        onChange={(option: any) => field.onChange(option ? option.value : '')}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.375rem',
                            padding: '1px',
                            boxShadow: 'none',
                            '&:hover': {
                              borderColor: '#cbd5e0',
                            },
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.patientId && (
                    <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="recordDate">Record Date</Label>
                  <Input
                    id="recordDate"
                    type="date"
                    {...register("recordDate", { required: "Date is required" })}
                  />
                  {errors.recordDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.recordDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="Primary diagnosis"
                  {...register("diagnosis", { required: "Diagnosis is required" })}
                />
                {errors.diagnosis && (
                  <p className="text-red-500 text-sm mt-1">{errors.diagnosis.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="symptoms">Symptoms</Label>
                <textarea
                  id="symptoms"
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  placeholder="Patient symptoms and presenting complaints"
                  {...register("symptoms")}
                ></textarea>
              </div>

              <div>
                <Label htmlFor="vitalSigns">Vital Signs</Label>
                <textarea
                  id="vitalSigns"
                  rows={2}
                  className="w-full p-2 border rounded-md"
                  placeholder="Blood pressure, temperature, heart rate, etc."
                  {...register("vitalSigns")}
                ></textarea>
              </div>

              <div>
                <Label htmlFor="notes">Clinical Notes</Label>
                <textarea
                  id="notes"
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  placeholder="Additional clinical notes"
                  {...register("notes")}
                ></textarea>
              </div>

              <div>
                <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                <textarea
                  id="treatmentPlan"
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  placeholder="Treatment recommendations and plan"
                  {...register("treatmentPlan")}
                ></textarea>
              </div>

              <div>
                <Label htmlFor="followUpDate">Follow-up Date (optional)</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  {...register("followUpDate")}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-4">
              <Link href="/medical-records">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Medical Record"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthLayout>
  );
}
