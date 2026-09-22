'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Do not show full SaaS sidebar/topnav shell on the public landing page (root route '/')
  if (pathname === '/') {
    return <main className="min-h-screen bg-[#F8FAFC]">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main layout container offset by desktop sidebar width (240px) */}
      <div className="flex-1 lg:pl-[240px] flex flex-col min-w-0">
        <TopNav onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
