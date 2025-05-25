import { avatars } from '@/models/client/config';
import { AuthorLink } from '@/components/AuthorLink';
import { Author } from '@/services/types';

export function AuthorInfo({ author }: { author: Author }) {
  return (
    <div className="ml-auto flex items-center gap-1">
      <picture>
        <img
          src={avatars.getInitials(author.name, 36, 36)}
          alt={author.name}
          className="rounded-md"
        />
      </picture>
      <AuthorLink author={author} />
      <p>{author.prefs?.reputation ?? 0}</p>
    </div>
  );
}
