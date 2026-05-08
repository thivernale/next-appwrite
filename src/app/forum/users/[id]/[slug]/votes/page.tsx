import { Navbar } from '@/app/forum/users/[id]/[slug]/votes/Navbar';
import { Pagination } from '@/components/Pagination';
import { Document, QuestionSummary, Vote } from '@/services/types';
import { searchVotes } from '@/services/voteService';
import { convertDateToRelativeTime } from '@/utils/relativeTime';
import { slugify } from '@/utils/slugify';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default async function AuthorVotesPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<{ page?: string; direction?: Vote['direction'] }>;
}>) {
  const { id } = await params;
  const { page = '1', direction = '' } = await searchParams;
  const LIMIT = 25;

  const votes = await searchVotes({
    page: +page || 1,
    limit: LIMIT,
    search: { authorId: id, direction },
  });

  function getQuestionLink(question: Document<QuestionSummary>, targetId?: string) {
    return (
      question && (
        <Link
          href={`/forum/questions/${question.$id}/${slugify(question.title)}${targetId ? `#${targetId}` : ''}`}
          className="text-green-500 duration-200 hover:text-green-600 dark:text-green-300 hover:dark:text-green-400"
        >
          <h2 className="text-xl">{question.title}</h2>
        </Link>
      )
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex justify-between">
        <p className="text-xl font-bold">{votes.total} votes</p>
        <div className="flex">
          <Navbar />
        </div>
      </div>

      <div className="mb-4 max-w-3xl space-y-6">
        {votes.documents.map(({ $id, $createdAt, direction, questionRel, answerRel }) => (
          <div key={$id} className="flex flex-col gap-2">
            <div className="flex">
              <p className="mr-4 flex shrink-0">
                {direction === 'up' ? (
                  <>
                    <ChevronUp /> upvote
                  </>
                ) : (
                  <>
                    <ChevronDown /> downvote
                  </>
                )}
              </p>
              {getQuestionLink(
                questionRel ?? answerRel!.questionRel,
                questionRel ? undefined : answerRel!.$id,
              )}
            </div>

            <div className="flex justify-end">
              <div className="text-secondary text-xs" title={$createdAt}>
                {convertDateToRelativeTime(new Date($createdAt))}
              </div>
            </div>

            <hr className="border-secondary my-4 w-full" />
          </div>
        ))}
      </div>

      <Pagination total={votes.total} limit={LIMIT} />
    </div>
  );
}
