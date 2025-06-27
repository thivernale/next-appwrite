'use client';

import { useAuthStore } from '@/store/Auth';
import Link from 'next/link';
import { slugify } from '@/utils/slugify';

export function EditUser({ authorId }: { authorId: string }) {
  const { user } = useAuthStore();

  if (!user || authorId !== user.$id) {
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
