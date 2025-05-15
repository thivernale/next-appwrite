'use client';

import { createContext, useContext, useState } from 'react';
import { Models } from 'appwrite';

export type UType = Models.User<Models.Preferences>;
type UCReturnType = ReturnType<typeof useState<UType>>;

export const UserContext = createContext<UCReturnType>([] as never as UCReturnType);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = UserContext.Provider;
