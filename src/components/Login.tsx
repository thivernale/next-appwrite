'use client';

import { useUserContext } from '@/context/UserContext';
import { authService, LoginType } from '@/services/authService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export function Login() {
  const [, setLoggedInUser] = useUserContext();
  const [formData, setFormData] = useState<LoginType>({ password: '', email: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const login = async () => {
    try {
      const session = await authService.login(formData);
      if (session) {
        setLoggedInUser(await authService.getCurrentUser());
        router.push('/profile');
      }
    } catch (e: unknown) {
      setError((e as { message: string }).message);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className={`bg-foreground/10 mx-auto w-full max-w-lg rounded-xl p-10`}>
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[60px]">
            <img src="/favicon.ico" alt="Logo" />
          </span>
        </div>
        <h2 className="text-center text-2xl leading-tight font-bold">Sign in to your account</h2>
        <p className="text-secondary mt-2 text-center text-base">
          Don&apos;t have any account?&nbsp;
          <Link
            href="/register"
            className="text-primary font-medium transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error !== '' && <p className="mt-8 text-center text-red-600">{error}</p>}
        <form className="mt-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="text-base font-medium">
                Email address
              </label>
              <div className="mt-2">
                <input
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleOnChange}
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-base font-medium">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleOnChange}
                  required
                />
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={login}
                className="bg-primary hover:bg-primary/80 inline-flex w-full items-center justify-center rounded-md px-3.5 py-2.5 leading-7 font-semibold text-white"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
