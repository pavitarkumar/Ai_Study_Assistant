'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Search,
  FileText,
  HelpCircle,
  Calendar,
  BarChart2,
  TrendingUp,
  Target,
  Settings,
  User,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Study Chat', href: '/study/chat', icon: MessageSquare },
    { label: 'Advanced Search', href: '/study/search', icon: Search },
    { label: 'My Documents', href: '/study/documents', icon: FileText },
    { label: 'Quiz', href: '/study/quiz', icon: HelpCircle },
    { label: 'Study Planner', href: '/study/planner', icon: Calendar },
    { label: 'Study Tracker', href: '/study/tracker', icon: BarChart2 },
    { label: 'Progress', href: '/progress', icon: TrendingUp },
    { label: 'Goals', href: '/goals', icon: Target },
  ];

  const bottomItems = [
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const content = (
    <div className="w-[240px] h-full bg-white border-r border-[#E2E8F0] flex flex-col justify-between select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 border-b border-[#E2E8F0] flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0] shadow-sm">
              <img src="/logo.jpg" alt="AI Study Assistant Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-semibold text-[15px] text-[#111827] tracking-tight block leading-tight">AI Study Assistant</span>
              <span className="text-[10px] text-[#64748B] font-medium tracking-wide uppercase">Personal Learning</span>
            </div>
          </Link>
          {mobileOpen && (
            <button onClick={onCloseMobile} className="p-1 rounded-md text-[#64748B] hover:bg-[#F1F5F9]">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#111827]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-[#E2E8F0] space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#111827]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
}
