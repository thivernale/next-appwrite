'use client';

import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    searchParams.set('search', search);

    router.push(`${pathname}?${searchParams}`, { scroll: false });
  }

  return (
    <form className="flex w-full flex-row gap-2" onSubmit={handleSearch}>
      <Input
        type="text"
        placeholder="Search questions"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="bg-accent hover:bg-accent/30 shrink-0 rounded-md px-4 py-2 font-bold"
        type="submit"
      >
        Search
      </button>
    </form>
  );
}
