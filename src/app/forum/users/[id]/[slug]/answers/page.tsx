import { Pagination } from '@/components/Pagination';
import { MDEditorPreview } from '@/components/MDEditor';
import { convertDateToRelativeTime } from '@/utils/relativeTime';
import Link from 'next/link';
import { slugify } from '@/utils/slugify';
import { searchAnswers } from '@/services/answerService';

export default async function AuthorAnswersPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page = '1' } = await searchParams;
  const LIMIT = 25;

  const answers = await searchAnswers({
    page: +page || 1,
    limit: LIMIT,
    search: { authorId: id },
  });

  return (
    <div className="container mx-auto px-4">
      <h2 className="mb-4 text-xl font-bold">{answers.total ?? 0} Answers</h2>
      {answers?.documents.map((answer) => (
        <div key={answer.$id} className="flex max-w-3xl flex-col gap-4">
          <div className="max-h-40 overflow-auto">
            <MDEditorPreview className="rounded-xl p-4 pl-6" source={answer.content} />
          </div>
          <div className="flex justify-between">
            {answer.questionRel && (
              <Link
                href={`/forum/questions/${answer.questionRel.$id}/${slugify(answer.questionRel.title)}`}
                className="bg-accent hover:bg-accent/30 shrink-0 rounded-md px-4 py-2 font-bold"
              >
                <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap lg:text-lg">
                  Question
                </span>
              </Link>
            )}
            <div className="flex flex-col items-stretch">
              <div className="text-secondary text-xs" title={answer.$createdAt}>
                answered {convertDateToRelativeTime(new Date(answer.$createdAt))}
              </div>
            </div>
          </div>

          <hr className="border-secondary my-4 w-full" />
        </div>
      ))}

      <Pagination total={answers.total} limit={LIMIT} />
    </div>
  );
}
