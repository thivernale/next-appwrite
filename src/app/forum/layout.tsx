import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Header } from '@/app/forum/components/Header';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dev Forum',
};

export default function ForumLayout({ children }: { children: ReactNode }) {
  return (
    <div className={cn(inter.className, '')}>
      <Header />
      <Toaster position={'top-right'} />
      {children}
    </div>
  );
}
