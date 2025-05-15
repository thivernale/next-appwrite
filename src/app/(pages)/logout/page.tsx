'use client';

import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authService } from '@/services/authService';

export default function LogoutPage() {
  const [loggedInUser, setLoggedInUser] = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (loggedInUser) {
      authService.logout().then(() => {
        setLoggedInUser(undefined);
        router.replace('/');
      });
    } else {
      router.replace('/');
    }
  }, [loggedInUser, setLoggedInUser, router]);

  return null;
};
