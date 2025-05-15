'use client';

import { Register } from '@/components/Register';
import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const [loggedInUser] = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (loggedInUser) {
      router.replace('/profile');
    }
  }, [loggedInUser, router]);

  return !loggedInUser && (
    <div className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <Register />
    </div>
  );
}
