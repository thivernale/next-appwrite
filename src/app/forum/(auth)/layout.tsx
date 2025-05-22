'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/Auth';
import { useRouter } from 'next/navigation';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('.');
    }
  }, [session, router]);

  return (
    !session && (
      <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
        <div className="relative">{children}</div>
      </div>
    )
  );
}
