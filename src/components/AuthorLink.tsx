import { cn } from '@/lib/utils';
import { Author } from '@/services/types';
import { slugify } from '@/utils/slugify';
import Link from 'next/link';

export function AuthorLink({
  author,
  className,
}: Readonly<{ author: Author; className?: string }>) {
  return (
    <Link
      href={`/forum/users/${author.$id}/${slugify(author.name)}`}
      className={cn(`text-green-500 hover:text-green-600`, className)}
    >
      {author.name}
    </Link>
  );
}
