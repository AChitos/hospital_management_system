"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, PencilIcon, CalendarIcon, ClipboardDocumentListIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/helpers";
import { api } from "@/lib/utils/apiClient";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  createdAt: string;
  updatedAt: string;
  medicalRecords?: MedicalRecord[];
  prescriptions?: Prescription[];
  appointments?: Appointment[];
}

interface MedicalRecord {
  id: string;
  recordDate: string;
  diagnosis: string;
  symptoms?: string;
  notes?: string;
  vitalSigns?: string;
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  issuedDate: string;
  expiryDate?: string;
}

interface Appointment {
  id: string;
  appointmentDate: string;
  status: string;
  notes?: string;
}

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) return;
      
      setIsLoading(true);
      
      try {
        // Fetch patient details from API
        const response = await api.get<Patient>(`/api/patients/${patientId}`);
        
        if (!response.data) {
          console.error("Error fetching patient:", response.error);
          setIsLoading(false);
          return;
        }
        
        const patientData = response.data;
        
        // Set patient data
        setPatient({
          id: patientData.id,
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          dateOfBirth: patientData.dateOfBirth,
          gender: patientData.gender,
          contactNumber: patientData.contactNumber,
          email: patientData.email,
          address: patientData.address,
          bloodType: patientData.bloodType,
          allergies: patientData.allergies,
          createdAt: patientData.createdAt,
          updatedAt: patientData.updatedAt,
        });
        
        // Set related data if available in the response
        if (patientData.medicalRecords) {
          setMedicalRecords(patientData.medicalRecords);
        }
        
        if (patientData.prescriptions) {
          setPrescriptions(patientData.prescriptions);
        }
        
        if (patientData.appointments) {
          setAppointments(patientData.appointments);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading patient information...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!patient) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">Patient not found</p>
            <Button onClick={() => router.push("/patients")}>
              Return to Patients List
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/patients" className="mr-4">
                <Button variant="outline" size="icon">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">
                {patient.firstName} {patient.lastName}
              </h1>
            </div>
            <Link href={`/patients/${patientId}/edit`}>
              <Button>
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Patient
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Patient Information */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p>{patient.firstName} {patient.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p>{calculateAge(patient.dateOfBirth)} years ({formatDate(patient.dateOfBirth)})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p>{patient.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p>{patient.bloodType || "Not recorded"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Allergies</p>
                  <p>{patient.allergies || "None"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{patient.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{patient.contactNumber || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{patient.address || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href={`/appointments/new?patientId=${patientId}`}>
                  <Button className="w-full justify-start" variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </Link>
                <Link href={`/prescriptions/new?patientId=${patientId}`}>
                  <Button className="w-full justify-start" variant="outline">
                    <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                    Create Prescription
                  </Button>
                </Link>
                <Link href={`/medical-records/new?patientId=${patientId}`}>
                  <Button className="w-full justify-start" variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Medical Record
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Records */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Medical Records</CardTitle>
            <Link href={`/medical-records?patientId=${patientId}`}>
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {medicalRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-left py-2 px-4">Diagnosis</th>
                      <th className="text-left py-2 px-4">Symptoms</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicalRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{formatDate(record.recordDate)}</td>
                        <td className="py-2 px-4">{record.diagnosis}</td>
                        <td className="py-2 px-4">{record.symptoms || "N/A"}</td>
                        <td className="py-2 px-4">
                          <Link href={`/medical-records/${record.id}`}>
                            <Button variant="link" className="p-0 h-auto">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No medical records found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prescriptions */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prescriptions</CardTitle>
            <Link href={`/prescriptions?patientId=${patientId}`}>
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {prescriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Medication</th>
                      <th className="text-left py-2 px-4">Dosage</th>
                      <th className="text-left py-2 px-4">Frequency</th>
                      <th className="text-left py-2 px-4">Issued Date</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((prescription) => (
                      <tr key={prescription.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{prescription.medication}</td>
                        <td className="py-2 px-4">{prescription.dosage}</td>
                        <td className="py-2 px-4">{prescription.frequency}</td>
                        <td className="py-2 px-4">{formatDate(prescription.issuedDate)}</td>
                        <td className="py-2 px-4">
                          <Link href={`/prescriptions/${prescription.id}`}>
                            <Button variant="link" className="p-0 h-auto">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No prescriptions found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Appointments</CardTitle>
            <Link href={`/appointments?patientId=${patientId}`}>
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Date & Time</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Notes</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{formatDate(appointment.appointmentDate, true)}</td>
                        <td className="py-2 px-4">
                          <span className={`inline-block px-2 py-1 text-xs rounded ${
                            appointment.status === "SCHEDULED" ? "bg-blue-100 text-blue-800" : 
                            appointment.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">{appointment.notes || "N/A"}</td>
                        <td className="py-2 px-4">
                          <Link href={`/appointments/${appointment.id}`}>
                            <Button variant="link" className="p-0 h-auto">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No appointments found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
