'use client';

import { Header } from '@/components/Header';
import { UserContextProvider, UType } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import { Blob } from '@/components/Blob';
import { authService } from '@/services/authService';

export default function CommonLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [loggedInUser, setLoggedInUser] = useState<UType | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void authService.getCurrentUser().then(value => {
      if (value !== null) {
        setLoggedInUser(value);
      }
    }).catch(reason => {
      console.error(reason);
    }).finally(() => setLoading(false));
  }, [setLoggedInUser]);

  return !loading && (
    <UserContextProvider value={[loggedInUser, setLoggedInUser]}>
      <div className="text-primary">
        <div className="fixed -z-[1] left-1/3 w-12 top-2/3 blur-2xl">
          <Blob blur />
        </div>
        <div className="fixed -z-[1] left-2/3 w-12 top-1/3 blur-2xl">
          <Blob blur />
        </div>
        <div className="fixed -z-[1] left-1/4 w-40 top-1/4 blur-2xl opacity-50">
          <Blob blur />
        </div>
        <div className="fixed -z-[1] left-1/2 w-32 top-1/2 blur-2xl opacity-60">
          <Blob blur />
        </div>
        <div className="fixed -z-[1] left-[45%] w-12 top-1/3 blur-2xl">
          <Blob blur />
        </div>
        <div className="fixed -z-[1] left-3/4 w-60 top-1/3 opacity-20 blur-2xl">
          <Blob blur />
        </div>
      </div>
      <Header />
      <main className="px-2 py-4">{children}</main>
    </UserContextProvider>
  );
}
