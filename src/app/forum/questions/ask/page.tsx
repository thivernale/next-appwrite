import { ManageQuestion } from '@/components/ManageQuestion';
import React from 'react';

export default async function QuestionAddPage() {
  return (
    <div className="container mx-auto flex flex-col px-4 pt-36 pb-20 xl:w-4xl">
      ️<h1 className="mb-4 text-2xl font-bold">🏗️🚧👷‍♀ Ask Your Question </h1>
      <ManageQuestion />
    </div>
  );
}
