'use client';

import { useAuthStore } from '@/store/Auth';
import { FloatingNav, NavItem } from '@/components/ui/floating-navbar';
import { IconHome, IconMessage, IconWorldQuestion } from '@tabler/icons-react';

export function Header() {
  const { session, user, logout } = useAuthStore();

  const navItems: NavItem[] = [
    {
      name: 'Home',
      link: '/forum',
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: 'Questions',
      link: '/forum/questions',
      icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];
  if (user) {
    navItems.push({
      name: 'Profile',
      link: `users/${user.$id}/${user.name as string}`, // TODO slugify
      icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
    });
  }

  let authItems: NavItem[] = [];
  if (!session) {
    authItems = [
      {
        name: 'Login',
        link: '/forum/login',
      },
      {
        name: 'Register',
        link: '/forum/register',
      },
    ];
  } else {
    authItems = [
      {
        name: 'Logout',
        onClick: logout,
        link: '',
      },
    ];
  }

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} authItems={authItems} />
    </div>
  );
}
