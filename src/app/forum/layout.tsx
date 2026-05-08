import { Header } from '@/app/forum/components/Header';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dev Forum',
};

export default function ForumLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className={cn(inter.className, '')}>
      <Header />
      <Toaster position={'top-right'} />
      {children}
    </div>
  );
}
