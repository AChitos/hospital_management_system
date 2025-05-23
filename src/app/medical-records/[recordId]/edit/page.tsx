"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MedicalRecordFormData {
  recordDate: string;
  diagnosis: string;
  symptoms?: string;
  vitalSigns?: string;
  notes?: string;
  treatmentPlan?: string;
  followUpDate?: string;
}

interface MedicalRecord extends MedicalRecordFormData {
  id: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function EditMedicalRecordPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.recordId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicalRecordFormData>();

  useEffect(() => {
    const fetchMedicalRecordData = async () => {
      try {
        // In a real app, we'd fetch from an API endpoint
        // For now using mock data
        setTimeout(() => {
          // Mock medical record data
          const mockRecord = {
            id: recordId,
            recordDate: "2025-05-10",  // Format for date input
            diagnosis: "Hypertension",
            symptoms: "Headache, dizziness, occasional chest discomfort",
            vitalSigns: "BP: 150/95, HR: 88, RR: 16, Temp: 37.1°C",
            notes: "Patient presented with elevated blood pressure readings over the past month. Reports increased stress at work and irregular sleep patterns.",
            treatmentPlan: "1. Prescribed Lisinopril 10mg once daily\n2. Recommended sodium-restricted diet\n3. Daily exercise minimum 30 minutes\n4. Stress reduction techniques discussed",
            followUpDate: "2025-06-10", // Format for date input
            patient: {
              id: "1",
              firstName: "John",
              lastName: "Doe",
            },
            doctor: {
              id: "doctor-1",
              firstName: "Jane",
              lastName: "Smith",
            }
          };
          
          setMedicalRecord(mockRecord);
          
          // Set form values
          reset(mockRecord);
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching medical record data:", error);
        setIsLoading(false);
      }
    };

    if (recordId) {
      fetchMedicalRecordData();
    }
  }, [recordId, reset]);

  const onSubmit = async (data: MedicalRecordFormData) => {
    setIsSaving(true);
    
    try {
      // In a real app, we would send this to an API
      console.log("Updated medical record data:", data);
      
      // Mock successful submission
      setTimeout(() => {
        setIsSaving(false);
        router.push(`/medical-records/${recordId}`);
      }, 1000);
      
    } catch (error) {
      console.error("Error updating medical record:", error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading medical record information...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!medicalRecord) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">Medical record not found</p>
            <Button onClick={() => router.push("/medical-records")}>
              Return to Medical Records List
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
          <div className="flex items-center">
            <Link href={`/medical-records/${recordId}`} className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Edit Medical Record</h1>
          </div>
          <p className="text-gray-500 mt-2">
            Patient: {medicalRecord.patient.firstName} {medicalRecord.patient.lastName}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Medical Record Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recordDate">Record Date *</Label>
                    <Input
                      id="recordDate"
                      type="date"
                      {...register("recordDate", { required: "Record date is required" })}
                      className={errors.recordDate ? "border-red-500" : ""}
                    />
                    {errors.recordDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.recordDate.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      {...register("followUpDate")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="diagnosis">Diagnosis *</Label>
                  <Input
                    id="diagnosis"
                    {...register("diagnosis", { required: "Diagnosis is required" })}
                    className={errors.diagnosis ? "border-red-500" : ""}
                  />
                  {errors.diagnosis && (
                    <p className="text-red-500 text-sm mt-1">{errors.diagnosis.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Input
                    id="symptoms"
                    {...register("symptoms")}
                  />
                </div>

                <div>
                  <Label htmlFor="vitalSigns">Vital Signs</Label>
                  <Input
                    id="vitalSigns"
                    {...register("vitalSigns")}
                    placeholder="BP: 120/80, HR: 72, RR: 16, Temp: 37.0°C"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Clinical Notes</Label>
                  <textarea
                    id="notes"
                    rows={4}
                    {...register("notes")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>

                <div>
                  <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                  <textarea
                    id="treatmentPlan"
                    rows={4}
                    {...register("treatmentPlan")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href={`/medical-records/${recordId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
