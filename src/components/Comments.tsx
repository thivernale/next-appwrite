import { convertDateToRelativeTime } from '@/utils/relativeTime';
import { Comment, Document } from '@/services/types';
import { AuthorLink } from '@/components/AuthorLink';

export function Comments({
                           comments,
                           type,
                         }: {
  comments: Document<Comment>[];
  type?: string;
  typeId?: string;
}) {
  return (
    <div>
      {comments?.map((comment) => (
        <div key={comment.$id} className="border-b border-gray-200 p-4">
          {comment.content} -{' '}
          <AuthorLink author={comment.author ?? { $id: comment.authorId, name: 'unknown' }} />{' '}
          <span title={comment.$createdAt}>{convertDateToRelativeTime(new Date(comment.$createdAt))}</span>
        </div>
      ))}
      <hr className="border-secondary w-full" />
      TODO add comment form
    </div>
  );
}
