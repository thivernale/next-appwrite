'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Author } from '@/services/types';
import { getUser } from '@/services/userService';
import { UserPreferences } from '@/store/Auth';

export default function QuestionViewPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const [author, setAuthor] = useState<Author>();
  const router = useRouter();

  useEffect(() => {
    params
      .then(({ id }) => getUser<UserPreferences>(id))
      .then((result) => {
        setAuthor(result);
      })
      .catch(() => {
        router.push('/forum/users');
        // redirect('/forum/users'); // for RSC
      });
  }, [setAuthor, params, router]);

  if (!author) {
    return null;
  }

  return (
    <div className="mx-auto px-4 pt-36 pb-20">
      <div className="flex">
        <div className="w-full">
          <h1 className="mb-1 text-3xl font-bold">{author.name}</h1>
          {/*<div className="flex justify-start gap-4">
            <span title={author.$createdAt}>
              asked {convertDateToRelativeTime(new Date(author.$createdAt))}
            </span>
            <span>{author.votesRel?.length ?? 0} votes</span>
            <span>{author.answersRel?.length ?? 0} answers</span>
          </div>*/}
        </div>
        {/*<Link href="/forum/questions/ask" className="ml-auto inline-block shrink-0">
          <span className="bg-accent hover:bg-accent/30 rounded-md px-4 py-2 font-bold">
            <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap lg:text-lg">
              Ask a question
            </span>
          </span>
        </Link>*/}
      </div>

      <hr className="border-secondary my-4" />
    </div>
  );
}
