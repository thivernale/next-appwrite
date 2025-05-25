import { Document, QuestionSummary } from '@/services/types';
import Link from 'next/link';
import { avatars } from '@/models/client/config';
import { slugify } from '@/utils/slugify';
import { convertDateToRelativeTime } from '@/utils/relativeTime';

export function QuestionCard({ question }: { question: Document<QuestionSummary> }) {
  return (
    <div className="border-accent/20 bg-accent/5 hover:bg-accent/10 relative flex flex-col gap-4 overflow-hidden rounded-xl border p-4 duration-200 sm:flex-row">
      <div className="relative shrink-0 text-sm sm:text-right">
        <p>{question.votesRel?.length ?? 0} votes</p>
        <p>{question.answersRel?.length ?? 0} answers</p>
      </div>
      <div className="relative w-full">
        <Link
          href={`/forum/questions/${question.$id}/${slugify(question.title)}`}
          className="text-green-500 duration-200 hover:text-green-600 dark:text-green-300 hover:dark:text-green-400"
        >
          <h2 className="text-xl">{question.title}</h2>
        </Link>
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
          <div className="ml-auto flex items-center gap-1">
            <picture>
              <img
                src={avatars.getInitials(question.author.name, 24, 24)}
                alt={question.author.name}
                className="rounded-lg"
              />
            </picture>
            <Link
              href={`/forum/users/${question.author.$id}/${slugify(question.author.name)}`}
              className="text-green-500 hover:text-green-600"
            >
              {question.author.name}
            </Link>
            <strong>&quot;{question.author.prefs.reputation ?? 0}&quot;</strong>
          </div>
          <span>asked {convertDateToRelativeTime(new Date(question.$createdAt))}</span>
        </div>
      </div>
    </div>
  );
}
