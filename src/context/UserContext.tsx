'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';

type UType = Awaited<ReturnType<typeof authService.getCurrentUser>>;
type UCReturnType = ReturnType<typeof useState<UType>>;

export const UserContext = createContext<UCReturnType>(undefined as never as UCReturnType);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  const useStateLoggedInUser = useState<UType>(null as never as UType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void authService.getCurrentUser().then(value => {
      if (value !== null) {
        useStateLoggedInUser[1](value);
      }
    }).catch(reason => {
      console.error(reason);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={useStateLoggedInUser as UCReturnType}>
      {!loading && children}
    </UserContext.Provider>
  );
};
