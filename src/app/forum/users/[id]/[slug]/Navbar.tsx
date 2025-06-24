import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export function Navbar() {
  const { id, slug } = useParams();
  const pathname = usePathname();
  const userProfileUrl = `/forum/users/${id}/${slug}`;

  const items = [
    {
      name: 'Summary',
      href: userProfileUrl,
    },
    { name: 'Questions', href: `${userProfileUrl}/questions` },
    { name: 'Answers', href: `${userProfileUrl}/answers` },
    {
      name: 'Votes',
      href: `${userProfileUrl}/votes`,
    },
  ];

  return (
    <ul className="flex w-full shrink-0 flex-row sm:w-40 sm:flex-col">
      {items.map(({ name, href }) => (
        <li key={name}>
          <Link
            href={href}
            className={`shrink-0 rounded-full px-3 py-1 duration-200 ${href === pathname ? 'bg-accent' : 'hover:bg-accent'}`}
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
