'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE]">
        <FileQuestion className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-md">
        <h2 className="text-2xl font-bold text-[#111827]">Page Not Found</h2>
        <p className="text-xs text-[#64748B] leading-relaxed">
          The study page or resource you are looking for does not exist or has been moved.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Go to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
