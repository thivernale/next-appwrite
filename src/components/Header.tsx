'use client';

import Link from 'next/link';
import { useUserContext } from '@/context/UserContext';
import Logo from '@/components/Logo';

const menuItems = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Forum',
    href: '/forum',
  },
];

export function Header() {
  const [loggedInUser] = useUserContext();

  return (
    <nav className="relative w-full py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2">
          <Link href={'/'} className="inline-block w-full max-w-[150px]">
            <Logo fill={'var(--color-primary)'} />
          </Link>
        </div>
        <div className="hidden grow items-start lg:flex">
          <ul className="ml-12 inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-foreground hover:text-primary inline-flex items-center text-sm font-semibold"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ul className="hidden space-x-2 lg:block">
          {loggedInUser ? (
            <>
              <Link
                href="/profile"
                className="text-primary hover:bg-primary/10 focus-visible:outline-primary rounded-md bg-transparent px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Profile
              </Link>
              <Link
                className="border-primary text-primary focus-visible:outline-primary rounded-md border px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                href="/logout"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                className="text-primary hover:bg-primary/10 focus-visible:outline-primary rounded-md bg-transparent px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="border-primary text-primary focus-visible:outline-primary rounded-md border px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                href="/register"
              >
                Register
              </Link>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
