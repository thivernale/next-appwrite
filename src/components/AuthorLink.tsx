import { Author } from '@/services/types';
import Link from 'next/link';
import { slugify } from '@/utils/slugify';
import { cn } from '@/lib/utils';

export function AuthorLink({ author, className }: { author: Author; className?: string }) {
  return (
    <Link
      href={`/forum/users/${author.$id}/${slugify(author.name as string)}`}
      className={cn(`text-green-500 hover:text-green-600`, className)}
    >
      {author.name}
    </Link>
  );
}
