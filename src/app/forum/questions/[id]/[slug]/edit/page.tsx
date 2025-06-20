'use client';

import { ManageQuestion } from '@/components/ManageQuestion';
import React, { useEffect, useState } from 'react';
import { getQuestion } from '@/services/questionService';
import { useAuthStore } from '@/store/Auth';
import { Document, Question } from '@/services/types';
import { useRouter } from 'next/navigation';
import { slugify } from '@/utils/slugify';

export default function QuestionEditPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { user } = useAuthStore();
  const [question, setQuestion] = useState<Document<Question>>();
  const router = useRouter();

  useEffect(() => {
    params
      .then(({ id }) => getQuestion(id))
      .then((result) => {
        setQuestion(result);
      })
      .catch(() => {
        router.push('/forum/questions');
      });
  }, [setQuestion, params, router]);

  useEffect(() => {
    if (question && (!user || user.$id !== question.authorId)) {
      router.push(`/forum/questions/${question.$id}/${slugify(question.title)}`);
    }
  }, [question, user]);

  if (!question || !user) return null;

  return (
    <div className="container mx-auto flex flex-col px-4 pt-36 pb-20 xl:w-4xl">
      ️<h1 className="mb-4 text-2xl font-bold">🏗️🚧👷‍♀ Edit Your Question </h1>
      <ManageQuestion question={question} />
    </div>
  );
}
