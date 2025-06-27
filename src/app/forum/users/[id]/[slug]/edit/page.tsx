'use client';

import { useAuthStore } from '@/store/Auth';
import React, { useActionState, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { slugify } from '@/utils/slugify';

type FormState = {
  error?: { message: string };
  success?: boolean;
};

export default function AuthorEditPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const [{ error }, formAction, isPending] = useActionState<FormState, FormData>(action, {});
  const [formData, setFormData] = useState<{ firstname: string; lastname: string }>({
    firstname: '',
    lastname: '',
  });
  const { updateUser, user } = useAuthStore();

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function action(state: FormState, payload: FormData): Promise<FormState> {
    const firstname = payload.get('firstname') as string;
    const lastname = payload.get('lastname') as string;

    if (!firstname || !lastname) {
      return {
        success: false,
        error: {
          message: 'Please fill out all the fields',
        },
      };
    }

    const updateResult = (await updateUser({
      name: `${firstname} ${lastname}`,
    })) as FormState;

    if (!updateResult.success) {
      return updateResult;
    }

    redirect(`/forum/users/${user.$id}/${slugify(firstname + ' ' + lastname)}/edit`);

    return updateResult;
  }

  useEffect(() => {
    params
      .then(({ id }) => {
        if (user.$id === (id as string)) {
          const [firstname, ...lastname] = user.name.split(' ');
          setFormData({ firstname, lastname: lastname.join(' ') });
        } else {
          throw new Error('Invalid user');
        }
      })
      .catch((err) => {
        console.log(err);
        redirect('/forum');
      });
  }, [user, params]);

  return (
    user && (
      <div className="container mx-auto px-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Your Profile</h1>

        {error && (
          <p className="text-destructive dark:text-destructive mt-8 text-center text-sm">
            {error.message}
          </p>
        )}
        <form action={formAction} className="mt-8 max-w-md">
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
          <button
            type="submit"
            disabled={isPending}
            className="bg-accent hover:bg-accent/30 shrink-0 rounded-md px-4 py-2"
          >
            {isPending ? 'Loading...' : 'Save'}
          </button>
        </form>
      </div>
    )
  );
}
