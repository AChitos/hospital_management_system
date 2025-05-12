"use client";

import React, { createContext, useEffect, useContext } from 'react';
import { useAuthStore } from '@/lib/auth/authStore';

// Create a context for the API token
export const ApiTokenContext = createContext<null | string>(null);

export function ApiTokenProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  
  // This component ensures the token is accessible throughout the app
  // and can be used by the API client for authenticated requests
  
  return (
    <ApiTokenContext.Provider value={token}>
      {children}
    </ApiTokenContext.Provider>
  );
}

// Custom hook to use the API token
export function useApiToken() {
  return useContext(ApiTokenContext);
}
