import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-2xl font-bold">404 — Page Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/forum/questions"
        className="bg-accent hover:bg-accent/30 rounded-md px-6 py-2 font-medium transition-colors"
      >
        Back to questions
      </Link>
    </div>
  );
}
