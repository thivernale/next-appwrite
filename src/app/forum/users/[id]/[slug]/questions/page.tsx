import { searchQuestions } from '@/services/questionService';
import { QuestionCard } from '@/components/QuestionCard';
import { Pagination } from '@/components/Pagination';

export default async function AuthorQuestionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page = '1' } = await searchParams;
  const LIMIT = 25;

  const questions = await searchQuestions({
    page: +page || 1,
    limit: LIMIT,
    search: { authorId: id },
  });

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 text-xl font-bold">{questions.total} questions</div>
      <div className="mb-4 max-w-3xl space-y-6">
        {questions.documents.map((question) => (
          <QuestionCard key={question.$id} question={question} />
        ))}
      </div>
      <Pagination total={questions.total} limit={LIMIT} />
    </div>
  );
}
