'use client';

import { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error('[RootError]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="bg-accent hover:bg-accent/30 rounded-md px-6 py-2 font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
