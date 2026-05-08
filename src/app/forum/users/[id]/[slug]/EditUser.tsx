'use client';

import { useAuthStore } from '@/store/Auth';
import { slugify } from '@/utils/slugify';
import Link from 'next/link';

export function EditUser({ authorId }: Readonly<{ authorId: string }>) {
  const { user } = useAuthStore();

  if (authorId !== user?.$id) {
    return null;
  }

  return (
    <Link
      href={`/forum/users/${authorId}/${slugify(user.name)}/edit`}
      title="Edit your profile"
      className="bg-accent hover:bg-accent/30 shrink-0 rounded-md px-4 py-2"
    >
      <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap lg:text-lg">
        Edit
      </span>
    </Link>
  );
}
