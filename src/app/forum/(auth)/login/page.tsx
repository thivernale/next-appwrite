'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { DATABASE_ID as appName } from '../../../../models/name';
import React, { useActionState, useState } from 'react';
import { useAuthStore } from '@/store/Auth';
import { LoginType } from '@/services/authService';

type FormState = {
  error?: { message: string };
  success?: boolean;
};

export default function LoginPage() {
  const [{ error }, formAction, isPending] = useActionState<FormState, FormData>(action, {});
  const [formData, setFormData] = useState<LoginType>({
    password: '',
    email: '',
  });

  const { login } = useAuthStore();

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function action(state: FormState, payload: FormData): Promise<FormState> {
    const email = payload.get('email') as string;
    const password = payload.get('password') as string;

    if (!email || !password) {
      return {
        success: false,
        error: {
          message: 'Please fill out all the fields',
        },
      };
    }

    return (await login({ email, password })) as FormState;
  }

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none border border-solid border-white/30 bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Login to {appName}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Login to {appName}
        <br /> If you don&#39;t have an account, you can{' '}
        <Link href="./register" className="text-primary hover:underline">
          register
        </Link>{' '}
        with {appName}
      </p>
      {error && (
        <p className="text-destructive dark:text-destructive mt-8 text-center text-sm">
          {error.message}
        </p>
      )}
      <form action={formAction} className="mt-8">
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
          {isPending ? 'Loading...' : 'Log in →'}
        </button>
      </form>
    </div>
  );
}
