'use client';

import React from 'react';
import { Login } from '@/components/Login';
import { useUserContext } from '@/context/UserContext';
import { Profile } from '@/components/Profile';
import nextConfig from '../../../next.config';

const HomePage = () => {
  const [loggedInUser] = useUserContext();

  return (
    <div className="w-full max-w-7xl mx-auto px-8">
      <div className="flex flex-wrap -mx-2 mt-32 gap-y-8">
        <div className="w-full sm:w-1/2 px-2 flex justify-center flex-wrap items-center">
          <div className="relative text-center w-full flex justify-center flex-wrap">
            <div className="w-full max-w-[100px]">
              <img src="/favicon.ico" alt="Logo" />
            </div>
            <div className="w-full">
              <h1 className="font-bold text-3xl mb-4">
                NextJS {nextConfig?.env?.version?.split('.')[0] ?? '15'} Authentication
                with <span className="text-primary">Appwrite</span>
              </h1>
              <p className="text-foreground/60">
                Integrate secure user authentication into your Next.js web applications using
                Appwrite, an open-source backend server. Follow along as we demonstrate the
                step-by-step process of setting up and implementing authentication
                functionality, ensuring the highest level of security for your users.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 px-2 flex flex-wrap justify-end">
          {loggedInUser ? (
            <div className="max-w-md">
              <Profile />
            </div>
          ) : (
            <Login />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
