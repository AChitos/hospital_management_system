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
      <div className="w-full max-w-md mb-8 text-center flex justify-center">
        <img 
          src="/icon-512.png" 
          alt="Clinic Tous Vents" 
          className="h-32 w-auto object-contain"
        />
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-sm text-gray-500 text-center">
        <p>© {new Date().getFullYear()} Clinic Tous Vents. All rights reserved.</p>
      </div>
    </div>
  );
}
