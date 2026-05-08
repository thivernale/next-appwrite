import { useAuthStore } from '@/store/Auth';
import { slugify } from '@/utils/slugify';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

export function EditQuestion({
  questionId,
  questionTitle,
  authorId,
}: Readonly<{
  questionId: string;
  questionTitle: string;
  authorId: string;
}>) {
  const { user } = useAuthStore();

  if (authorId !== user?.$id) {
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
