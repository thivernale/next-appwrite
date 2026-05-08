'use client';

import { FloatingNav, NavItem } from '@/components/ui/floating-navbar';
import { useAuthStore } from '@/store/Auth';
import { slugify } from '@/utils/slugify';
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
      link: `/forum/users/${user.$id}/${slugify(user.name)}`,
      icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
    });
  }

  let authItems: NavItem[] = [];
  if (session) {
    authItems = [
      {
        name: 'Logout',
        onClick: logout,
        link: '',
      },
    ];
  } else {
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
  }

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} authItems={authItems} />
    </div>
  );
}
