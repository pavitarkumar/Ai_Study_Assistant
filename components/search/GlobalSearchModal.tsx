'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, MessageSquare, FileText, HelpCircle, Calendar, BarChart2, X, Sparkles } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const routes = [
    { name: 'Dashboard', path: '/dashboard', category: 'Page', icon: LayoutDashboard },
    { name: 'AI Study Chat', path: '/study/chat', category: 'Page', icon: MessageSquare },
    { name: 'Advanced Search', path: '/study/search', category: 'Page', icon: Search },
    { name: 'My Documents', path: '/study/documents', category: 'Page', icon: FileText },
    { name: 'AI Quiz', path: '/study/quiz', category: 'Page', icon: HelpCircle },
    { name: 'Study Planner', path: '/study/planner', category: 'Page', icon: Calendar },
    { name: 'Operating Systems Notes.pdf', path: '/study/documents', category: 'Document', icon: FileText },
    { name: 'Trees Lecture.pdf', path: '/study/documents', category: 'Document', icon: FileText },
    { name: 'Graphs Traversal (BFS/DFS)', path: '/study/quiz?topic=Graphs', category: 'Topic', icon: Sparkles },
    { name: 'Deadlock Prevention in OS', path: '/study/chat', category: 'Conversation', icon: MessageSquare },
  ];

  const filtered = routes.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-[14px] shadow-lg overflow-hidden">
        {/* Input */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#64748B]" />
          <input
            type="text"
            placeholder="Type a command or search... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-sm bg-transparent border-none text-[#111827] focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-md text-[#64748B] hover:bg-[#F1F5F9]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-[#64748B]">No matching commands or study materials found.</div>
          ) : (
            filtered.map((r, idx) => {
              const Icon = r.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(r.path)}
                  className="w-full p-2.5 rounded-lg flex items-center justify-between hover:bg-[#F8FAFC] text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-medium text-[#111827]">{r.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-semibold">
                    {r.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
