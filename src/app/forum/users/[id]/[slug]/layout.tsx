'use client';

import { ReactNode, useEffect, useState } from 'react';
import { getUser } from '@/services/userService';
import { UserPreferences } from '@/store/Auth';
import { Author } from '@/services/types';
import { redirect } from 'next/navigation';
import { avatars } from '@/models/client/config';
import { convertDateToRelativeTime } from '@/utils/relativeTime';
import { IconClockFilled, IconUserFilled } from '@tabler/icons-react';
import { Navbar } from '@/app/forum/users/[id]/[slug]/Navbar';

/*export const metadata: Metadata = {
  title: 'User Profile',
};*/

export default function UserLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string; slug: string }>;
}) {
  const [author, setAuthor] = useState<Author>();

  useEffect(() => {
    params
      .then(({ id }) => getUser<UserPreferences>(id))
      .then((result) => {
        setAuthor(result);
      })
      .catch(() => {
        redirect('/forum'); // for RSC
      });
  }, [setAuthor, params]);

  return (
    author && (
      <div className="container mx-auto space-y-4 px-4 pt-32 pb-20">
        <div className="flex flex-col gap-4 sm:flex-row">
          <picture className="w-40 shrink-0">
            <img
              src={avatars.getInitials(author.name, 200, 200)}
              alt={author.name}
              className="rounded-lg"
            />
          </picture>
          <div className="w-full">
            <div className="flex items-start justify-between">
              <div className="block space-y-1">
                <h1 className="text-3xl font-bold">{author.name}</h1>
                <div className="text-lg font-bold">{author.email}</div>
                <p className={'flex flex-row items-center gap-1 text-sm'}>
                  <IconUserFilled className="h-4 w-4" /> Registered{' '}
                  {convertDateToRelativeTime(new Date(author.$createdAt))}
                </p>
                <p className={'flex flex-row items-center gap-1 text-sm'}>
                  <IconClockFilled className="h-4 w-4" /> Last activity{' '}
                  {convertDateToRelativeTime(new Date(author.$updatedAt))}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Navbar />
          <div className="w-full">{children}</div>
        </div>
      </div>
    )
  );
}
