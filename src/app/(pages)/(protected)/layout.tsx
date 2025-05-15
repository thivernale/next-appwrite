'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';

export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [loggedInUser] = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!loggedInUser) {
      router.replace('/login');
    }
  }, [loggedInUser, router]);

  return children;
}
