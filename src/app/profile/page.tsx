"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/auth/authStore";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
    watch,
  } = useForm<PasswordFormData>();

  // Watch for password fields to validate confirmation
  const newPassword = watch("newPassword");

  // Set profile form values when user data becomes available
  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsProfileLoading(true);
    setProfileMessage(null);
    
    try {
      // In a real app, we would update via API
      console.log("Updating profile with data:", data);
      
      // Mock successful update
      setTimeout(() => {
        setIsProfileLoading(false);
        setProfileMessage({
          type: "success",
          text: "Profile updated successfully",
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsProfileLoading(false);
      setProfileMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsPasswordLoading(true);
    setPasswordMessage(null);
    
    try {
      // In a real app, we would update via API
      console.log("Updating password", data);
      
      // Mock successful update
      setTimeout(() => {
        setIsPasswordLoading(false);
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully",
        });
        resetPassword();
      }, 1000);
      
    } catch (error) {
      console.error("Error changing password:", error);
      setIsPasswordLoading(false);
      setPasswordMessage({
        type: "error",
        text: "Failed to change password. Please verify your current password and try again.",
      });
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      autoComplete="given-name"
                      {...registerProfile("firstName", { required: "First name is required" })}
                    />
                    {profileErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      autoComplete="family-name"
                      {...registerProfile("lastName", { required: "Last name is required" })}
                    />
                    {profileErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...registerProfile("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      } 
                    })}
                  />
                  {profileErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>
                  )}
                </div>
                {profileMessage && (
                  <div className={`mt-4 p-2 rounded ${
                    profileMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {profileMessage.text}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isProfileLoading}>
                  {isProfileLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <KeyIcon className="h-5 w-5 mr-2" />
                Change Password
              </CardTitle>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    {...registerPassword("currentPassword", { required: "Current password is required" })}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    {...registerPassword("newPassword", { 
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      } 
                    })}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...registerPassword("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: value => value === newPassword || "Passwords do not match" 
                    })}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
                {passwordMessage && (
                  <div className={`mt-4 p-2 rounded ${
                    passwordMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading ? "Changing..." : "Change Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AuthLayout>
  );
}
