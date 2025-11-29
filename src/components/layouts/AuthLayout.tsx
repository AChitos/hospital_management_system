// AuthLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuthStore } from "@/lib/auth/authStore";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Show nothing until we confirm authentication status
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        
        <div 
          className="flex-1 px-4 py-6 overflow-auto lg:px-6"
          onClick={() => {
            // Close sidebar when clicking on main content (mobile only)
            if (isSidebarOpen && window.innerWidth < 1024) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <main className="max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
