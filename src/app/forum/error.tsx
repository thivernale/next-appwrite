'use client';

import { useEffect } from 'react';

export default function ForumError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error('[ForumError]', error);
  }, [error]);

  const isPaused = error.message?.toLowerCase().includes('project is paused');
  const isUnauthorized =
    error.message?.toLowerCase().includes('unauthorized') ||
    error.message?.toLowerCase().includes('missing scope');

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {isPaused ? (
        <>
          <div className="mb-4 text-5xl">⏸</div>
          <h2 className="mb-2 text-2xl font-bold">Service Unavailable</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            The backend project is paused due to inactivity. Please restore it from the{' '}
            <a
              href="https://cloud.appwrite.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-foreground underline underline-offset-4"
            >
              Appwrite Console
            </a>{' '}
            to resume operations.
          </p>
          <button
            onClick={reset}
            className="bg-accent hover:bg-accent/80 rounded-md px-6 py-2 font-medium transition-colors"
          >
            Try again
          </button>
        </>
      ) : isUnauthorized ? (
        <>
          <div className="mb-4 text-5xl">🔒</div>
          <h2 className="mb-2 text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You don&apos;t have permission to view this content.
          </p>
          <button
            onClick={reset}
            className="bg-accent hover:bg-accent/80 rounded-md px-6 py-2 font-medium transition-colors"
          >
            Go back
          </button>
        </>
      ) : (
        <>
          <div className="mb-4 text-5xl">⚠</div>
          <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {error.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={reset}
            className="bg-accent hover:bg-accent/80 rounded-md px-6 py-2 font-medium transition-colors"
          >
            Try again
          </button>
        </>
      )}
    </div>
  );
}
