import { convertDateToRelativeTime } from '@/utils/relativeTime';
import { Answer, Comment, Document, Question } from '@/services/types';
import { AuthorLink } from '@/components/AuthorLink';
import { useAuthStore } from '@/store/Auth';
import { Trash2 } from 'lucide-react';
import { createComment, deleteComment } from '@/services/commentService';
import { useState } from 'react';
import { AddComment } from '@/components/AddComment';

export function Comments({
  comments: initialComments,
  type,
  typeId,
}: {
  comments: Document<Comment>[];
  type: 'question' | 'answer';
  typeId: string;
}) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState(initialComments);

  function handleDelete(id: string) {
    deleteComment(id)
      .then(() => {
        setComments((prevState) => prevState.filter((value) => value.$id !== id));
      })
      .catch((reason) => console.log(reason));
  }

  function handleAdd(content: string): Promise<void> {
    if (!user) {
      throw new Error('User not logged in!');
    }

    const data = {
      content,
      authorId: user.$id,
      type,
      typeId,
      answerRel: (type === 'answer' ? typeId : null) as unknown as Document<Answer>,
      questionRel: (type !== 'answer' ? typeId : null) as unknown as Document<Question>,
    };

    return createComment(data).then((comment) => {
      setComments((prevState) => [...prevState, { ...comment, author: user }]);
    });
  }

  return (
    <div className="flex flex-col gap-2 pl-4">
      {comments?.map((comment) => (
        <div key={comment.$id} className="border-b border-gray-200 p-4">
          {comment.content} -{' '}
          <AuthorLink author={comment.author ?? { $id: comment.authorId, name: 'unknown' }} />{' '}
          <span title={comment.$createdAt}>
            {convertDateToRelativeTime(new Date(comment.$createdAt))}
          </span>
          {user!.$id === comment.authorId && (
            <button className="mx-2" onClick={() => handleDelete(comment.$id)}>
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <hr className="border-secondary w-full" />
      <AddComment onSubmit={handleAdd} />
    </div>
  );
}
