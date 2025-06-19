import { useAuthStore } from '@/store/Auth';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { slugify } from '@/utils/slugify';

export function EditQuestion({
  questionId,
  questionTitle,
  authorId,
}: {
  questionId: string;
  questionTitle: string;
  authorId: string;
}) {
  const { user } = useAuthStore();

  if (!user || authorId !== user.$id) {
    return null;
  }

  return (
    <Link
      href={`/forum/questions/${questionId}/${slugify(questionTitle)}/edit`}
      title="Edit question"
    >
      <Pencil />
    </Link>
  );
}
