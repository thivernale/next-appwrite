import { avatars } from '@/models/client/config';
import { AuthorLink } from '@/components/AuthorLink';
import { Author } from '@/services/types';

export function AuthorInfo({ author }: { author: Author }) {
  return (
    <div className="flex items-center justify-start gap-2">
      <picture>
        <img
          src={avatars.getInitials(author.name, 36, 36)}
          alt={author.name}
          className="rounded-md"
        />
      </picture>
      <div className="leading-tight">
        <AuthorLink author={author} />
        <p className="font-semibold">{author.prefs?.reputation ?? 0}</p>
      </div>
    </div>
  );
}
