import { getQuestion } from '@/services/questionService';
import { convertDateToRelativeTime } from '@/utils/relativeTime';
import Link from 'next/link';
import { getAttachment } from '@/services/storageService';
import { ChevronDown, ChevronUp, ChevronUpCircle, Pencil, Trash2 } from 'lucide-react';
import { MDEditorPreview } from '@/components/MDEditor';
import { Answers } from '@/components/Answers';
import { Comments } from '@/components/Comments';
import { AuthorInfo } from '@/components/AuthorInfo';

export default async function QuestionViewPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  const question = await getQuestion(id);

  return (
    <div className="mx-auto px-4 pt-36 pb-20">
      <div className="flex">
        <div className="w-full">
          <h1 className="mb-1 text-3xl font-bold">{question.title}</h1>
          <div className="flex justify-start gap-4">
            <span>asked {convertDateToRelativeTime(new Date(question.$createdAt))}</span>
            <span>{question.votesRel?.length ?? 0} votes</span>
            <span>{question.answersRel?.length ?? 0} answers</span>
          </div>
        </div>
        <Link href="/forum/questions/ask" className="ml-auto inline-block shrink-0">
          <span className="bg-accent hover:bg-accent/30 rounded-md px-4 py-2 font-bold">
            <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap lg:text-lg">
              Ask a question
            </span>
          </span>
        </Link>
      </div>

      <hr className="border-secondary my-4" />

      <div className="flex gap-4">
        <div className="flex shrink-0 flex-col items-center gap-4">
          TODO votes, edit, delete
          <ChevronUp />
          <ChevronUpCircle />
          <ChevronDown />
          <Pencil />
          <Trash2 />
        </div>

        <div className="w-full overflow-auto">
          <MDEditorPreview className="rounded-xl p-4 pl-6" source={question.content} />
          {question.attachmentId && (
            <picture>
              <img
                src={getAttachment(question.attachmentId)}
                alt={question.title}
                className="mt-2 rounded-lg"
              />
            </picture>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            {question.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/forum/questions?tag=${tag}`}
                className="bg-accent/10 hover:bg-accent/20 inline-block rounded-lg px-2 py-0.5 duration-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
          <div className="flex w-full justify-end">
            <AuthorInfo author={question.author} />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Comments comments={question.commentsRel} type={'question'} typeId={question.$id} />

            <hr className="border-secondary my-4 w-full" />
          </div>
        </div>
      </div>
      {/*end question*/}

      <Answers answers={question.answersRel} questionId={question.$id} />
    </div>
  );
}
