import { getUser } from '@/services/userService';
import { UserPreferences } from '@/store/Auth';
import { searchQuestions } from '@/services/questionService';
import { searchAnswers } from '@/services/answerService';

export default async function AuthorSummaryPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  const [author, questions, answers] = await Promise.all([
    getUser<UserPreferences>(id),
    searchQuestions({
      limit: 1,
      search: { authorId: id },
    }),
    searchAnswers({
      limit: 1,
      search: { authorId: id },
    }),
  ]).catch((err) => {
    console.error(err);
  });

  return (
    author && (
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="border-secondary basis-1/3 rounded-lg border p-4">
            <h1 className="mb-1 text-xl font-bold">Reputation</h1>
            <p className="flex items-center justify-center text-4xl lg:h-40">
              <span>{author.prefs.reputation ?? 0}</span>
            </p>
          </div>
          <div className="border-secondary basis-1/3 rounded-lg border p-4">
            <h1 className="mb-1 text-xl font-bold">Questions asked</h1>
            <p className="flex items-center justify-center text-4xl lg:h-40">
              <span>{questions.total ?? 0}</span>
            </p>
          </div>
          <div className="border-secondary basis-1/3 rounded-lg border p-4">
            <h1 className="mb-1 text-xl font-bold">Answers given</h1>
            <p className="flex items-center justify-center text-4xl lg:h-40">
              <span>{answers.total ?? 0}</span>
            </p>
          </div>
        </div>
      </div>
    )
  );
}
