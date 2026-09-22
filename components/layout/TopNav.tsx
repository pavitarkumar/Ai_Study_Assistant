'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Menu, Mic } from 'lucide-react';
import { VoiceAssistantModal } from '../voice/VoiceAssistantModal';
import { GlobalSearchModal } from '../search/GlobalSearchModal';

interface TopNavProps {
  onOpenMobileSidebar?: () => void;
}

export function TopNav({ onOpenMobileSidebar }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getPageTitle = (path: string) => {
    if (path.includes('/study/chat')) return 'AI Study Chat';
    if (path.includes('/study/search')) return 'Advanced Search';
    if (path.includes('/study/documents')) return 'My Documents';
    if (path.includes('/study/quiz')) return 'AI Quiz';
    if (path.includes('/study/planner')) return 'Study Planner';
    if (path.includes('/study/tracker')) return 'Study Tracker';
    if (path.includes('/progress')) return 'Your Progress';
    if (path.includes('/goals')) return 'Study Goals';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/admin')) return 'Admin Dashboard';
    return 'Dashboard';
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E2E8F0] sticky top-0 z-20 flex items-center justify-between px-4 lg:px-8">
        {/* Left Side: Mobile Menu Button & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9]"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-[#111827]">{getPageTitle(pathname)}</h1>
          </div>
        </div>

        {/* Right Side: Global Search (Ctrl+K), Voice Launcher, Notification & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#64748B] hover:border-[#2563EB] transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search study material...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[10px] font-semibold text-[#111827]">
              Ctrl+K
            </kbd>
          </button>

          {/* Voice Assistant Button */}
          <button
            onClick={() => setVoiceOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-medium text-[#111827] hover:bg-[#F8FAFC] transition-colors"
            title="Voice Study Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </button>

          {/* Notification Icon */}
          <button className="p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] relative" title="Notifications">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#2563EB] absolute top-2 right-2" />
          </button>

          {/* Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] font-semibold text-xs flex items-center justify-center">
              DS
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-[#111827] block leading-tight">Demo Student</span>
              <span className="text-[10px] text-[#64748B]">Intermediate</span>
            </div>
          </div>
        </div>
      </header>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />

      {/* Global Search Ctrl+K Modal */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
