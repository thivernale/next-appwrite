'use client';

import React, { useActionState, useState } from 'react';
import { RegisterType } from '@/services/authService';
import { useAuthStore } from '@/store/Auth';
import { DATABASE_ID as appName } from '@/models/name';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type FormState = {
  error?: { message: string };
  success?: boolean;
};

export default function RegisterPage() {
  const [{ error }, formAction, isPending] = useActionState<FormState, FormData>(action, {});
  const [formData, setFormData] = useState<
    Omit<RegisterType, 'name'> & { firstname: string; lastname: string }
  >({
    firstname: '',
    lastname: '',
    password: '',
    email: '',
  });

  const { createUser, login } = useAuthStore();

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function action(state: FormState, payload: FormData): Promise<FormState> {
    const email = payload.get('email') as string;
    const password = payload.get('password') as string;
    const firstname = payload.get('firstname') as string;
    const lastname = payload.get('lastname') as string;

    if (!email || !password || !firstname || !lastname) {
      return {
        success: false,
        error: {
          message: 'Please fill out all the fields',
        },
      };
    }

    const signupResult = (await createUser({
      email,
      password,
      name: `${firstname} ${lastname}`,
    })) as FormState;

    if (!signupResult.success) {
      return signupResult;
    }

    return (await login({ email, password })) as FormState;
  }

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none border border-solid border-white/30 bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to {appName}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Register to {appName} if you you don&apos;t have an account.
        <br /> If you have an account, you can{' '}
        <Link href="./login" className="text-primary hover:underline">
          login
        </Link>{' '}
        to {appName}
      </p>
      {error && (
        <p className="text-destructive dark:text-destructive mt-8 text-center text-sm">
          {error.message}
        </p>
      )}
      <form action={formAction} className="mt-8">
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleOnChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleOnChange}
            />
          </div>
        </div>
        <div className="mb-4 space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleOnChange}
            required
          ></Input>
        </div>
        <div className="mb-4 space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleOnChange}
            required
          ></Input>
        </div>
        <button type="submit" disabled={isPending} className="w-full rounded-md font-medium">
          {isPending ? 'Loading...' : 'Sign up →'}
        </button>
      </form>
    </div>
  );
}
