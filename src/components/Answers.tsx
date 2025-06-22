import { MDEditorPreview } from '@/components/MDEditor';
import { convertDateToRelativeTime } from '@/utils/relativeTime';
import { Comments } from '@/components/Comments';
import { Answer, Document } from '@/services/types';
import { AuthorInfo } from '@/components/AuthorInfo';
import { AddAnswer } from '@/components/AddAnswer';
import { DeleteAnswer } from '@/components/DeleteAnswer';
import { VoteButtons } from '@/components/VoteButtons';
import { useQuestionContext } from '@/context/QuestionContext';

export function Answers({ answers }: { answers: Document<Answer>[]; questionId: string }) {
  const [question, setQuestion] = useQuestionContext();

  function handleDelete(id: string) {
    // TODO traverse question and update author reputation
    setQuestion({
      ...question!,
      answersRel: (question!.answersRel || []).filter((answer) => answer.$id !== id),
    });
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{answers.length ?? 0} Answers</h2>

      {answers?.map((answer) => (
        <div key={answer.$id} className="flex gap-4">
          <div className="flex shrink-0 flex-col items-center gap-4">
            <VoteButtons
              votes={answer.votesRel ?? []}
              type={'answer'}
              typeId={answer.$id}
              authorId={answer.authorId}
            />
            <DeleteAnswer
              answerId={answer.$id}
              authorId={answer.authorId}
              onDelete={() => handleDelete(answer.$id)}
            />
          </div>

          <div className="w-full overflow-auto">
            <MDEditorPreview className="rounded-xl p-4 pl-6" source={answer.content} />

            <div className="flex justify-end">
              <div className="flex flex-col items-stretch">
                <div className="text-secondary text-xs" title={answer.$createdAt}>
                  answered {convertDateToRelativeTime(new Date(answer.$createdAt))}
                </div>
                <AuthorInfo author={answer.author ?? { $id: answer.authorId, name: 'unknown' }} />
              </div>
            </div>

            <Comments comments={answer.commentsRel} type={'answer'} typeId={answer.$id} />

            <hr className="border-secondary my-4 w-full" />
          </div>
        </div>
      ))}

      <hr className="border-secondary my-4 w-full" />

      <AddAnswer />
    </div>
  );
}
