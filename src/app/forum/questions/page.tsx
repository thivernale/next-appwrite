import Link from 'next/link';
import { Search } from '@/app/forum/questions/Search';
import { searchQuestions } from '@/services/questionService';
import { QuestionCard } from '@/components/QuestionCard';
import { Pagination } from '@/components/Pagination';

export default async function QuestionListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) {
  const { page = '1', search = '', tag = '' } = await searchParams;

  const LIMIT = 25;
  const questions = await searchQuestions({
    page: +page || 1,
    limit: LIMIT,
    search: { search, tag },
  });

  return (
    <div className="container mx-auto px-4 pt-36 pb-20">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Link
          href="/forum/questions/ask"
          className="bg-accent hover:bg-accent/30 shrink-0 rounded-md px-4 py-2 font-bold"
        >
          <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap lg:text-lg">
            Ask a question
          </span>
        </Link>
      </div>
      <div className="mb-4">
        <Search />
      </div>
      <div className="mb-4">{questions.total} questions</div>
      <div className="mb-4 max-w-3xl space-y-6">
        {questions.documents.map((question) => (
          <QuestionCard key={question.$id} question={question} />
        ))}
      </div>
      <Pagination total={questions.total} limit={LIMIT} />
    </div>
  );
}
