'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function Pagination({ total = 0, limit = 25 }: { total: number; limit: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const pageNumber = parseInt(page);
  const totalPages = total ? Math.ceil(total / limit) : 1;

  function handleNavigate(offset: -1 | 1) {
    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set('page', String(pageNumber + offset));
    router.push(`${pathname}?${urlSearchParams}`);
  }

  return (
    <div className="mx-auto flex flex-row items-center justify-center gap-2">
      <button
        className="bg-accent hover:bg-accent/30 rounded-md px-4 py-2 disabled:text-gray-400"
        disabled={pageNumber <= 1}
        onClick={() => handleNavigate(-1)}
      >
        &laquo; Prev
      </button>
      <div className="page">
        {page} of {totalPages}
      </div>
      <button
        className="bg-accent hover:bg-accent/30 rounded-md px-4 py-2 disabled:text-gray-400"
        disabled={pageNumber >= totalPages}
        onClick={() => handleNavigate(1)}
      >
        Next &raquo;
      </button>
    </div>
  );
}
