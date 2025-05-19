import { NextResponse } from 'next/server';
import { getOrCreateDatabase } from '@/models/server/dbInit';
import { getOrCreateStorageBucket } from '@/models/server/storage.bucket';

// This function can be marked `async` if using `await` inside
export async function middleware(/*request: NextRequest*/) {
  // do stuff
  await getOrCreateStorageBucket();
  await getOrCreateDatabase();

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
