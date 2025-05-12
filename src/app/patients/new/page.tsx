"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
}

export default function NewPatientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    defaultValues: {
      gender: "",
      bloodType: "",
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    setIsLoading(true);
    
    try {
      // In a real app, we would send this to an API
      console.log("Patient data:", data);
      
      // Mock successful submission
      setTimeout(() => {
        setIsLoading(false);
        router.push("/patients");
      }, 1000);
      
    } catch (error) {
      console.error("Error creating patient:", error);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center">
            <Link href="/patients" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Add New Patient</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName", { required: "First name is required" })}
                      placeholder="John"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register("lastName", { required: "Last name is required" })}
                      placeholder="Doe"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth", { required: "Date of birth is required" })}
                      className={errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      {...register("gender", { required: "Gender is required" })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.gender ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <select
                    id="bloodType"
                    {...register("bloodType")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    {...register("allergies")}
                    placeholder="Penicillin, Peanuts, etc."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="john.doe@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    {...register("contactNumber")}
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/patients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Patient"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
