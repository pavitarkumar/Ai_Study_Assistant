import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'AI Study Assistant - Personalized AI Learning Platform',
  description: 'Learn smarter, practice better, and stay on track with a personal AI study assistant.',
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAFC] text-[#111827]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
