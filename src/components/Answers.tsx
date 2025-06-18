import { MDEditorPreview } from '@/components/MDEditor';
import { convertDateToRelativeTime } from '@/utils/relativeTime';
import { Comments } from '@/components/Comments';
import { Answer, Document } from '@/services/types';
import { AuthorInfo } from '@/components/AuthorInfo';
import { AddAnswer } from '@/components/AddAnswer';

export function Answers({ answers }: { answers: Document<Answer>[]; questionId: string }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{answers.length ?? 0} Answers</h2>

      {answers?.map((answer) => (
        <div key={answer.$id} className="flex gap-4">
          <div className="flex shrink-0 flex-col items-center gap-4">TODO votes, edit, delete</div>

          <div className="w-full overflow-auto">
            <MDEditorPreview className="rounded-xl p-4 pl-6" source={answer.content} />

            <div className="flex w-full justify-end">
              <div>
                <div className="text-secondary text-sm" title={answer.$createdAt}>
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
