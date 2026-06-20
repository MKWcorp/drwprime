'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function AdminDashboard() {
  const { isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      // Redirect to My Prime dashboard
      router.push('/my-prime');
    }
  }, [isLoaded, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-primary text-xl">Redirecting to My Prime...</div>
    </div>
  );
}
