"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm";
import { useAuthStore } from "@/lib/auth/authStore";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600">Clinic Tous Vents</h1>
        <p className="mt-2 text-gray-600">Healthcare Management System</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-sm text-gray-500 text-center">
        <p>© {new Date().getFullYear()} Clinic Tous Vents. All rights reserved.</p>
      </div>
    </div>
  );
}
