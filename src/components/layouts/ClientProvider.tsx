"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth/authStore";
import { ApiTokenProvider } from "@/components/providers/ApiTokenProvider";

interface ClientProviderProps {
  children: ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const { isAuthenticated, token, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  
  // Suppress hydration warnings in development mode
  useEffect(() => {
    // This is to suppress the hydration warning which is likely caused by browser extensions
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('Expected server HTML to contain a matching') ||
         args[0].includes('Hydration failed because') ||
         args[0].includes('did not match') ||
         args[0].includes('Text content does not match'))
      ) {
        return;
      }
      // Make sure we don't call this if args is empty or undefined
      if (args && args.length > 0) {
        originalConsoleError(...args);
      }
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    // Check if we're not on the login page and not authenticated
    const isProtectedRoute = pathname !== "/" && !pathname.startsWith("/api/");
    if (isProtectedRoute && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  // Add interceptor for all fetch requests to include auth token
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // Clone the init object to avoid mutating the original
      const modifiedInit = { ...init } as RequestInit;
      
      // Only add the token for API requests to our backend
      const url = input.toString();
      if (url.includes("/api/") && token) {
        modifiedInit.headers = {
          ...modifiedInit.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      
      return originalFetch(input, modifiedInit);
    };
    
    // Clean up on unmount
    return () => {
      window.fetch = originalFetch;
    };
  }, [token]);

  return (
    <ApiTokenProvider>
      {children}
    </ApiTokenProvider>
  );
}
