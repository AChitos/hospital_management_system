'use client';

import { useEffect, useState } from 'react';

// This component suppresses hydration errors caused by browser extensions
export function HydrationErrorSuppress({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use this state to force client-side rendering only after hydration
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // When the component mounts, we know we're on the client
    setIsClient(true);
  }, []);

  // On first render, don't render the children to avoid hydration mismatch
  // After hydration completes, render normally
  return <>{isClient ? children : null}</>;
}
