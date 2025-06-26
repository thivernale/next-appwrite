'use client';

import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import React from 'react';

export function Navbar() {
  const { id, slug } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const votesUrl = `/forum/users/${id}/${slug}/votes`;

  const items = [
    {
      name: 'All',
      href: votesUrl,
    },
    {
      name: 'Upvotes',
      href: `${votesUrl}?direction=up`,
    },
    {
      name: 'Downvotes',
      href: `${votesUrl}?direction=down`,
    },
  ];

  return (
    <ul className="flex w-full shrink-0 flex-row gap-1 overflow-auto">
      {items.map(({ name, href }) => (
        <li key={name}>
          <Link
            href={href}
            className={`block w-full rounded-full px-3 py-1 duration-200 ${href === pathname + (searchParams.get('direction') ? '?' + searchParams : '') ? 'bg-accent' : 'hover:bg-accent'}`}
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
